mod runtime_recovery;

#[cfg(desktop)]
mod desktop_window;

#[cfg(desktop)]
mod tray;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default();

    #[cfg(desktop)]
    let builder = builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
        desktop_window::show_main_window(app);
    }));

    builder
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            #[cfg(desktop)]
            {
                let handle = app.handle();

                tray::init_tray(app)?;
                handle.plugin(tauri_plugin_updater::Builder::new().build())?;
                runtime_recovery::init_native_runtime_recovery(handle.clone());
            }

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
