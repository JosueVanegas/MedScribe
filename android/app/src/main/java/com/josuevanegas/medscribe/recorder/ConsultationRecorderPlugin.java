package com.josuevanegas.medscribe.recorder;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.SystemClock;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.io.File;

/**
 * Native consultation recorder exposed to the web app as "ConsultationRecorder".
 * Records AAC (M4A) while a foreground service keeps microphone access
 * alive with the screen locked or the app in the background.
 */
@CapacitorPlugin(
    name = "ConsultationRecorder",
    permissions = {
        @Permission(alias = "microphone", strings = { Manifest.permission.RECORD_AUDIO }),
        @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS }),
    }
)
public class ConsultationRecorderPlugin extends Plugin {

    // Speech-optimised: 16 kHz mono AAC ≈ 14 MB per hour.
    private static final int SAMPLE_RATE = 16_000;
    private static final int BIT_RATE = 32_000;

    private MediaRecorder recorder;
    private File outputFile;
    private long startedAt;

    @PluginMethod
    public void start(PluginCall call) {
        if (recorder != null) {
            call.reject("Ya hay una grabación en curso.", "ALREADY_RECORDING");
            return;
        }
        if (getPermissionState("microphone") != PermissionState.GRANTED) {
            requestPermissionForAlias("microphone", call, "onMicrophonePermission");
            return;
        }
        requestNotificationsThenStart(call);
    }

    @PermissionCallback
    private void onMicrophonePermission(PluginCall call) {
        if (getPermissionState("microphone") != PermissionState.GRANTED) {
            call.reject("Permiso de micrófono denegado.", "PERMISSION_DENIED");
            return;
        }
        requestNotificationsThenStart(call);
    }

    /** Android 13+: without this the recording works but its notification is hidden. */
    private void requestNotificationsThenStart(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
            && getPermissionState("notifications") == PermissionState.PROMPT) {
            requestPermissionForAlias("notifications", call, "onNotificationsPermission");
            return;
        }
        startRecording(call);
    }

    @PermissionCallback
    private void onNotificationsPermission(PluginCall call) {
        startRecording(call); // optional permission: continue either way
    }

    @SuppressWarnings("deprecation") // MediaRecorder() is the only constructor before Android 12
    private void startRecording(PluginCall call) {
        Context context = getContext();
        outputFile = new File(context.getCacheDir(), "consulta-" + System.currentTimeMillis() + ".m4a");

        // Start the foreground service first, while the app is visible (required on Android 14+).
        ContextCompat.startForegroundService(context, new Intent(context, RecordingService.class));

        try {
            recorder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
                ? new MediaRecorder(context)
                : new MediaRecorder();
            recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
            recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
            recorder.setAudioChannels(1);
            recorder.setAudioSamplingRate(SAMPLE_RATE);
            recorder.setAudioEncodingBitRate(BIT_RATE);
            recorder.setOutputFile(outputFile.getAbsolutePath());
            recorder.prepare();
            recorder.start();
            startedAt = SystemClock.elapsedRealtime();
            call.resolve();
        } catch (Exception e) {
            cleanup(true);
            call.reject("No se pudo iniciar la grabación: " + e.getMessage(), "START_FAILED", e);
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (recorder == null) {
            call.reject("No hay ninguna grabación en curso.", "NOT_RECORDING");
            return;
        }
        long durationMs = SystemClock.elapsedRealtime() - startedAt;
        File file = outputFile;
        try {
            recorder.stop();
        } catch (RuntimeException e) {
            // Thrown when stopped right after starting (no audio frames yet).
            cleanup(true);
            call.reject("La grabación es demasiado corta.", "EMPTY_RECORDING");
            return;
        }
        cleanup(false);

        JSObject result = new JSObject();
        result.put("path", file.getAbsolutePath());
        result.put("mimeType", "audio/mp4");
        result.put("durationMs", durationMs);
        result.put("size", file.length());
        call.resolve(result);
    }

    /** Stops without keeping audio (e.g. the screen was closed mid-recording). */
    @PluginMethod
    public void cancel(PluginCall call) {
        cleanup(true);
        call.resolve();
    }

    /** Deletes a finished recording once the web app has read it. */
    @PluginMethod
    public void discard(PluginCall call) {
        String path = call.getString("path");
        File cacheDir = getContext().getCacheDir();
        if (path != null) {
            File file = new File(path);
            // Only files this plugin created, inside the app cache.
            if (cacheDir.equals(file.getParentFile()) && file.getName().startsWith("consulta-")) {
                //noinspection ResultOfMethodCallIgnored
                file.delete();
            }
        }
        call.resolve();
    }

    private void cleanup(boolean deleteFile) {
        if (recorder != null) {
            try {
                recorder.release();
            } catch (Exception ignored) {
                // already released
            }
            recorder = null;
        }
        Context context = getContext();
        context.stopService(new Intent(context, RecordingService.class));
        if (deleteFile && outputFile != null) {
            //noinspection ResultOfMethodCallIgnored
            outputFile.delete();
        }
        outputFile = null;
    }

    @Override
    protected void handleOnDestroy() {
        cleanup(true);
        super.handleOnDestroy();
    }
}
