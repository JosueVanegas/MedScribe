package com.josuevanegas.medscribe;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.josuevanegas.medscribe.recorder.ConsultationRecorderPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Local plugins must be registered before the bridge starts.
        registerPlugin(ConsultationRecorderPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
