export default () => document.cookie.split(";").forEach(function(cookie) { document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });

