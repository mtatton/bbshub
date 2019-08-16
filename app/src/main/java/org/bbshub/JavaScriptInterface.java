package org.bbshub;

import android.app.NotificationManager;
import android.content.Context;
import android.os.Environment;
import android.os.Handler;
import android.util.Base64;
import android.util.Log;
import android.webkit.JavascriptInterface;

import androidx.core.app.NotificationCompat;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.util.Date;

import static android.content.ContentValues.TAG;

public class JavaScriptInterface {


        private Context context;
        private NotificationManager nm;
        public JavaScriptInterface(Context context) {
            this.context = context;
        }

        @JavascriptInterface
        public void getBase64FromBlobData(String base64Data, String FileName) throws IOException {
            convertBase64StringToPdfAndStoreIt(base64Data, FileName);
        }

        public static String getBase64StringFromBlobUrl(String blobUrl){
            if(blobUrl.startsWith("blob")){
                return "javascript: var xhr = new XMLHttpRequest();" +
                        "xhr.open('GET', '" + blobUrl + "', true);" +
                        "xhr.setRequestHeader('Content-type','application/octet-stream');" +
                        "xhr.responseType = 'blob';" +
                        "xhr.onload = function(e) {" +
                        "    if (this.status == 200) {" +
                        "        var blobPdf = this.response;" +
                        "        var reader = new FileReader();" +
                        "        reader.readAsDataURL(blobPdf);" +
                        "        reader.onloadend = function() {" +
                        "            base64data = reader.result;" +
                        "            console.log(base64data);" +
                        "            Android.getBase64FromBlobData(base64data,ZModemFileName);" +
                        "        }" +
                        "    }" +
                        "};" +
                        "xhr.send();";
            }
            return "javascript: console.log('It is not a Blob URL');";
        }
        private void convertBase64StringToPdfAndStoreIt(String base64PDf, String FileName) throws IOException {
            final int notificationId = 1;
            String currentDateTime = DateFormat.getDateTimeInstance().format(new Date());
            final File dwldsPath = new File(Environment.getExternalStoragePublicDirectory(
                    Environment.DIRECTORY_DOWNLOADS) + "/" + FileName);
            Log.d(TAG,"DIRECTORY DOWNLOAD: " + Environment.DIRECTORY_DOWNLOADS);
            String state = Environment.getExternalStorageState();
            if (Environment.MEDIA_MOUNTED.equals(state)) {
              byte[] pdfAsBytes = Base64.decode(base64PDf.replaceFirst("^data:application/octet-binary;base64,", ""), 0);
              //byte[] pdfAsBytes = Base64.decode(base64PDf, 0);
              FileOutputStream os;
              os = new FileOutputStream(dwldsPath, false);
              os.write(pdfAsBytes);
              os.flush();
            } else {
              Log.d(TAG,"Media now writable.");
            }

            /*
            if(dwldsPath.exists()) {
                NotificationCompat.Builder b = new NotificationCompat.Builder(context, "MY_DL");
                b.setDefaults(NotificationCompat.DEFAULT_ALL);
                b.setWhen(System.currentTimeMillis());
                b.setSmallIcon(R.drawable.ic_launcher_background);
                b.setContentTitle("MY TITLE");
                b.setContentText("MY TEXT CONTENT");
                nm = (NotificationManager) this.context.getSystemService(Context.NOTIFICATION_SERVICE);
                if(nm != null) {
                    nm.notify(notificationId, b.build());
                    Handler h = new Handler();
                    long delayInMilliseconds = 5000;
                    h.postDelayed(new Runnable() {
                        public void run() {
                            nm.cancel(notificationId);
                        }
                    }, delayInMilliseconds);
                }
            }
            */
        }

}
