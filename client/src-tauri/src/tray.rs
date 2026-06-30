use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    App, Runtime,
};

use crate::desktop_window::{hide_main_window, hide_main_window_on_close, show_main_window};

const TRAY_ID: &str = "main";
const TRAY_OPEN_ID: &str = "open";
const TRAY_HIDE_ID: &str = "hide";
const TRAY_QUIT_ID: &str = "quit";

pub fn init_tray<R: Runtime>(app: &App<R>) -> tauri::Result<()> {
    let open_item = MenuItem::with_id(app, TRAY_OPEN_ID, "Open K-Room", true, None::<&str>)?;
    let hide_item = MenuItem::with_id(app, TRAY_HIDE_ID, "Hide", true, None::<&str>)?;
    let quit_item = MenuItem::with_id(app, TRAY_QUIT_ID, "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&open_item, &hide_item, &quit_item])?;
    let mut tray_builder = TrayIconBuilder::with_id(TRAY_ID)
        .tooltip("K-Room")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id().as_ref() {
            TRAY_OPEN_ID => show_main_window(app),
            TRAY_HIDE_ID => hide_main_window(app),
            TRAY_QUIT_ID => app.exit(0),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                show_main_window(tray.app_handle());
            }
        });

    if let Some(icon) = app.default_window_icon().cloned() {
        tray_builder = tray_builder.icon(icon);
    }

    tray_builder.build(app)?;
    hide_main_window_on_close(app);

    Ok(())
}
