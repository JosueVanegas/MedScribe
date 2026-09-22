use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      #[cfg(windows)]
      if let Some(window) = app.get_webview_window("main") {
        microphone::allow_for_app_content(&window)?;
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

/// MedScribe is a recording app: its own UI may use the microphone without
/// WebView2's browser-style "http://tauri.localhost wants to use your
/// microphone" prompt. Windows' microphone privacy settings still apply.
/// Only the microphone, and only for the app's own content, is granted.
#[cfg(windows)]
mod microphone {
  use webview2_com::Microsoft::Web::WebView2::Win32::{
    COREWEBVIEW2_PERMISSION_KIND, COREWEBVIEW2_PERMISSION_KIND_MICROPHONE,
    COREWEBVIEW2_PERMISSION_STATE_ALLOW,
  };
  use webview2_com::{take_pwstr, PermissionRequestedEventHandler};
  use windows_core::PWSTR;

  fn is_app_content(uri: &str) -> bool {
    uri.starts_with("http://tauri.localhost")
      || uri.starts_with("https://tauri.localhost")
      // `tauri dev` serves the UI from the Next.js dev server.
      || (cfg!(debug_assertions) && uri.starts_with("http://localhost:"))
  }

  pub fn allow_for_app_content(window: &tauri::WebviewWindow) -> tauri::Result<()> {
    window.with_webview(|webview| unsafe {
      let Ok(core) = webview.controller().CoreWebView2() else {
        return;
      };

      let handler = PermissionRequestedEventHandler::create(Box::new(|_, args| {
        let Some(args) = args else { return Ok(()) };

        let mut kind = COREWEBVIEW2_PERMISSION_KIND::default();
        args.PermissionKind(&mut kind)?;
        let mut uri = PWSTR::null();
        args.Uri(&mut uri)?;

        if kind == COREWEBVIEW2_PERMISSION_KIND_MICROPHONE && is_app_content(&take_pwstr(uri)) {
          args.SetState(COREWEBVIEW2_PERMISSION_STATE_ALLOW)?;
        }
        Ok(())
      }));

      let mut token = 0i64;
      if let Err(err) = core.add_PermissionRequested(&handler, &mut token) {
        log::warn!("could not register microphone permission handler: {err}");
      }
    })
  }
}
