use tauri::{App, AppHandle, Manager, Runtime, WindowEvent};

const MAIN_WINDOW_LABEL: &str = "main";

pub fn hide_main_window_on_close<R: Runtime>(app: &App<R>) {
    if let Some(window) = app.get_webview_window(MAIN_WINDOW_LABEL) {
        let window_to_hide = window.clone();

        window.on_window_event(move |event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window_to_hide.hide();
            }
        });
    }
}

pub fn show_main_window<R: Runtime>(app: &AppHandle<R>) {
    if let Some(window) = app.get_webview_window(MAIN_WINDOW_LABEL) {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

pub fn hide_main_window<R: Runtime>(app: &AppHandle<R>) {
    if let Some(window) = app.get_webview_window(MAIN_WINDOW_LABEL) {
        let _ = window.hide();
    }
}
