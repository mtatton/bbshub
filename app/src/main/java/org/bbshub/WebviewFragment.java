package org.bbshub;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.DownloadListener;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class WebviewFragment extends Fragment {
    WebView browser;

    // invoke this method after set your WebViewClient and ChromeClient
    public void browserSettings() {
        browser.getSettings().setJavaScriptEnabled(true);
        browser.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                browser.loadUrl(JavaScriptInterface.getBase64StringFromBlobUrl(url));
            }
        });
        browser.getSettings().setAppCachePath(getActivity().getApplicationContext().getCacheDir().getAbsolutePath());
        browser.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);
        browser.getSettings().setDatabaseEnabled(true);
        browser.getSettings().setDomStorageEnabled(true);
        browser.getSettings().setUseWideViewPort(true);
        browser.getSettings().setLoadWithOverviewMode(true);
        browser.addJavascriptInterface(new JavaScriptInterface(getContext()), "Android");
        browser.getSettings().setPluginState(WebSettings.PluginState.ON);
    }
}
