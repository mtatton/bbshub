package org.bbshub;

import android.util.Log;
import android.webkit.JavascriptInterface;

import static androidx.constraintlayout.widget.Constraints.TAG;

class JsInterface {

    @JavascriptInterface
    public void receiveString(String value) {
        Log.d(TAG, value);
    }

}
