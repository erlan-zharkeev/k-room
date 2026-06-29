#[cfg(desktop)]
use tauri::{AppHandle, Runtime};

#[cfg(all(desktop, not(debug_assertions)))]
use std::time::Duration;

#[cfg(all(desktop, not(debug_assertions)))]
use serde::Deserialize;
#[cfg(all(desktop, not(debug_assertions)))]
use tauri_plugin_updater::UpdaterExt;

#[cfg(all(desktop, not(debug_assertions)))]
const CLIENT_RUNTIME_POLICY_URL: &str = "https://api.k-room.space/api/client/runtime-policy";
#[cfg(all(desktop, not(debug_assertions)))]
const CLIENT_RUNTIME_POLICY_TIMEOUT_SECS: u64 = 5;
#[cfg(all(desktop, not(debug_assertions)))]
const HARD_UPDATE_ACTION: &str = "hard-update";
#[cfg(all(desktop, not(debug_assertions)))]
const NATIVE_DESKTOP_PLATFORM: &str = "native-desktop";

#[cfg(all(desktop, not(debug_assertions)))]
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ClientRuntimePolicy {
    is_blocked: bool,
    action: String,
}

#[cfg(desktop)]
pub fn init_native_runtime_recovery<R: Runtime>(app: AppHandle<R>) {
    #[cfg(debug_assertions)]
    {
        let _ = app;
    }

    #[cfg(not(debug_assertions))]
    {
        tauri::async_runtime::spawn(async move {
            if let Err(error) = recover_blocked_native_client(app).await {
                log::warn!("native runtime recovery skipped: {error}");
            }
        });
    }
}

#[cfg(all(desktop, not(debug_assertions)))]
async fn recover_blocked_native_client<R: Runtime>(app: AppHandle<R>) -> Result<(), String> {
    let current_version = app.package_info().version.to_string();
    let policy = load_client_runtime_policy(&current_version).await?;

    if !should_apply_hard_update(&policy) {
        return Ok(());
    }

    let updater = app.updater().map_err(|error| error.to_string())?;
    let update = updater.check().await.map_err(|error| error.to_string())?;
    let Some(update) = update else {
        log::warn!(
            "native client version {current_version} is blocked, but no desktop update is available"
        );

        return Ok(());
    };

    log::warn!(
        "native client version {current_version} is blocked; installing desktop update {}",
        update.version
    );
    update
        .download_and_install(|_, _| {}, || {})
        .await
        .map_err(|error| error.to_string())?;

    app.restart();
}

#[cfg(all(desktop, not(debug_assertions)))]
async fn load_client_runtime_policy(version: &str) -> Result<ClientRuntimePolicy, String> {
    ensure_rustls_crypto_provider();

    reqwest::Client::builder()
        .timeout(Duration::from_secs(CLIENT_RUNTIME_POLICY_TIMEOUT_SECS))
        .build()
        .map_err(|error| error.to_string())?
        .get(CLIENT_RUNTIME_POLICY_URL)
        .query(&[("version", version), ("platform", NATIVE_DESKTOP_PLATFORM)])
        .send()
        .await
        .map_err(|error| error.to_string())?
        .error_for_status()
        .map_err(|error| error.to_string())?
        .json::<ClientRuntimePolicy>()
        .await
        .map_err(|error| error.to_string())
}

#[cfg(all(desktop, not(debug_assertions)))]
fn ensure_rustls_crypto_provider() {
    let _ = rustls::crypto::ring::default_provider().install_default();
}

#[cfg(all(desktop, not(debug_assertions)))]
fn should_apply_hard_update(policy: &ClientRuntimePolicy) -> bool {
    policy.is_blocked && policy.action == HARD_UPDATE_ACTION
}
