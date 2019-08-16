/*
// SAMPLE
// ------
// 
// 	all zmodem transactions are done using frames. a frame consists
// 	of a header followed by one or more data subpackets.
// 	a typical (simple) zmodem file transfer looks like this :
// 
// 	    sender                      receiver
// 
// 		ZRQINIT(0)
// 							        ZRINIT
// 		ZFILE
// 							        ZRPOS
// 		ZDATA data ...
// 		ZEOF
// 							        ZRINIT
// 		ZFIN
// 							        ZFIN
// 		OO
// 
// 	zmodem continuously	transmits data unless the receiver interrupts
// 	the sender to request retransmission of garbled data.
// 	zmodem in effect uses the entire file as a window.
// 
//         FRAME TYPES
// 	-----------
// 
 		ZRQINIT		0x00	* request receive init (s->r) *
 		ZRINIT		0x01	* receive init (r->s) *
 		ZSINIT		0x02	* send init sequence (optional) (s->r) *
 		ZACK		0x03	* ack to ZRQINIT ZRINIT or ZSINIT (s<->r) *
 		ZFILE		0x04	* file name (s->r) *
 		ZSKIP		0x05	* skip this file (r->s) *
 		ZNAK		0x06	* last packet was corrupted (?) *
 		ZABORT		0x07	* abort batch transfers (?) *
 		ZFIN		0x08	* finish session (s<->r) *
 		ZRPOS		0x09	* resume data transmission here (r->s) *
 		ZDATA		0x0a	* data packet(s) follow (s->r) *
 		ZEOF		0x0b	* end of file reached (s->r) *
 		ZFERR		0x0c	* fatal read or write error detected (?) *
 		ZCRC		0x0d	* request for file CRC and response (?) *
 		ZCHALLENGE	0x0e	* security challenge (r->s) *
 		ZCOMPL		0x0f	* request is complete (?) *	
 		ZCAN		0x10	* pseudo frame; 
 							   other end cancelled session with 5* CAN *
 		ZFREECNT	0x11	* request free bytes on file system (s->r) *
 		ZCOMMAND	0x12	* issue command (s->r) *
 		ZSTDERR		0x13	* output data to stderr (??) *

11.5  ZFILE

This frame denotes the beginning of a file transmission attempt.
ZF0, ZF1, and ZF2 may contain options.  A value of 0 in each of these
bytes implies no special treatment.  Options specified to the
receiver override options specified to the sender with the exception
of ZCBIN.  A ZCBIN from the sender overrides any other Conversion
Option given to the receiver except ZCRESUM.  A ZCBIN from the
receiver overrides any other Conversion Option sent by the sender.

*/

var ZModemReceive = (function () {

    function ZModemReceive(crt, connection) {
        this.ontransfercomplete = new TypedEvent();
        this.SOH = 0x01;
        this.ZRQINIT = 0x00; // HERE ZRQINIT
        //this.ZRINIT = 0x01;  // HERE ZRINIT
        this.SOH = 0x01;
        this.STX = 0x02;
        this.EOT = 0x04;
        this.ZFILE = 0x04; // HERE file name (s->r)
        this.ACK = 0x06;
        this.ZRPOS = 0x09; // resume data transmission here (r->s)
        this.NAK = 0x15; // NAK
        this.CAN = 0x18; // CANCELL 
        this.C   = 0x43;
        this.CAPG = 'G'.charCodeAt(0);
        this._ExpectingHeader = true;
        this._Files = [];
        this._LastGTime = 0;
        this._NextByte = 0;
        this._ShouldSendG = true;
        this._TotalBytesReceived = 0;
        this._Crt = crt;
        this._Connection = connection;
        // ZMODEM
        this.ZPAD = '*';
        this.ZDLE = String.fromCharCode(24);
        this.ZHEX = 'B';
        this.ZBIN = 'A';
 
    }

  // ZMODEM INIT PACKET (c) 2019 --

  ZModemReceive.prototype.hexToInt = function(val) {
    return(val.toString());
  }

  ZModemReceive.prototype.hexToChar = function(val) {
    return(String.fromCharCode(val.toString()));
  }

  ZModemReceive.prototype.IToChar = function(val) {
    return(val.toString());
  }
  
  ZModemReceive.prototype.IToHex8 = function(val) {
    var tmp = val.toString(16);
    var ret = ("0000000"+tmp).slice(-7).toUpperCase();
    return(ret);
  }

  ZModemReceive.prototype.IToHex4 = function(val) {
    var tmp = val.toString(16);
    var ret = ("000"+tmp).slice(-4).toUpperCase();
    return(ret);
  }

  ZModemReceive.prototype.IToHex = function(val) {
    var tmp = val.toString(16);
    var ret = ("0"+tmp).slice(-2).toUpperCase();
    return(ret);
  }

   ZModemReceive.prototype.hexToBytes = function(hex) {
      //for (var bytes = [], c = 0; c < hex.length; c += 2)
      //for (var bytes = new ByteArray(), c = 0; c < hex.length; c += 2)
      pkt = new ByteArray();
      for (c=0;c<hex.length;c+=2) {
        pkt.writeByte(parseInt(hex.substr(c, 2), 16)); 
      }
      return(pkt);
    }
    

   ZModemReceive.prototype.ZRINIT_Header_ZF0 = function() { // HERE

     /// <summary> Rx can send and receive true FDX </summary>
     var CANFULLDUPLEX = 0x1;
     /// <summary> Rx can receive data during disk I/O </summary>
     var CANOVERLAPIO = 0x2;
     /// <summary> Rx can send a break signal </summary>
     var CANBREAK = 0x4;
     /// <summary> Receiver can decrypt </summary>
     var CANDECRYPT = 0x10;
     /// <summary> Receiver can uncompress </summary>
     var CANLZW = 0x20;
     /// <summary> Receiver can use 32 bit Frame Check </summary>
     var CANCRC32 = 0x40;
     /// <summary> Receiver expects ctl chars to be escaped </summary>
     var ESCAPECONTOL = 0x100;
     /// <summary> Receiver expects 8th bit to be escaped </summary>
     var ESCAPE8BIT = 0x200;

  }

  ZModemReceive.prototype.getZRINIT = function() {

  var ZPAD = '*';
  var ZDLE = String.fromCharCode(24);
  var ZHEX = 'B';
  var ZBIN = 'A';
 
  var XON = 0x011;
  var XOFF = 0x013;
  var CR = 0x0D;
  var LF = 0x0A;
  
  var HEX_COMMON_HEADER = this.IToChar(ZPAD) + this.IToChar(ZPAD) + this.IToChar(ZDLE) + this.IToChar(ZHEX);
  
  var PKT_LEN = 1024;
  var ZRINIT = 0x1;
  
  var PKT_TYPE = ZRINIT;

  var TRCAPA = 0; // TRANSFER CAPABILITIES

  var TRPFORT = TRCAPA >> 0x8; // A2
  //var TRPFAIBLE =  TRCAPA - TRPFORT * 256; // A3
  var TRPFAIBLE =  TRCAPA - TRPFORT * 0xFF; // A3
  var BLFORT = PKT_LEN >> 0x8; // A1
  var BLFAIBLE = PKT_LEN - BLFORT * 256; // A0
  
  //var ZRINIT = HEX_COMMON_HEADER + this.IToHex(PKT_TYPE) + this.IToHex(BLFAIBLE) + this.IToHex(BLFORT) + this.IToHex(TRPFAIBLE) + this.IToHex(TRPFAIBLE);
  var ZRINIT = HEX_COMMON_HEADER + this.IToHex(PKT_TYPE) + this.IToHex(BLFAIBLE) + this.IToHex(BLFORT) + this.IToHex(TRPFORT) + this.IToHex(TRPFAIBLE);

  var END_OF_COMMAND = this.IToHex(CR) + this.IToHex(LF) + this.IToHex(XON);

  var ZRINIT_PKT = ZRINIT + this.IToHex4(CRC.Calculate16(this.hexToBytes(ZRINIT))) + END_OF_COMMAND;

  return (ZRINIT_PKT);

}

  ZModemReceive.prototype.getZRPOS = function(position) {

  // TEST #0001: REMOVED XON FROM ZRPOS PACKET
  // TEST #0001: REMOVED BLFAIBLE FROM ZRINIT // THERE WAS ACTUALLY A BUG IN ZRINIT

  // <PAD><PAD><ZDLE> 42 30 39 30 30 30 30 30 30 30 30 61 38 37 63 <CR><LF>

  var ZPAD = '*';
  var ZDLE = String.fromCharCode(24);
  var ZHEX = 'B';
  var ZBIN = 'A';
 
  var XON = 0x011;
  var XOFF = 0x013;
  var CR = 0x0D;
  var LF = 0x0A;
  
  var PKT_LEN = 1024;
  var ZRPOS = 0x9;

  var PKT_TYPE = this.IToHex(ZRPOS);

  var hex_pos = this.IToHex8(position);

  var HEX_COMMON_HEADER=this.IToChar(ZPAD)+this.IToChar(ZPAD)+this.IToChar(ZDLE)+this.IToChar(ZHEX);

  var ZRPOS_PKT = HEX_COMMON_HEADER + PKT_TYPE + hex_pos.substring(6,2) + hex_pos.substring(4,2) + hex_pos.substring(2,2) + hex_pos.substring(0,2);

  var END_OF_COMMAND = this.IToHex(CR) + this.IToHex(LF); //  + this.IToHex(XON);

  var ZRPOS_PKT = ZRPOS_PKT + this.IToHex4(CRC.Calculate16(this.hexToBytes(ZRPOS_PKT))) + END_OF_COMMAND;

  console.log("-> ZRPOS_PKT: " + ZRPOS_PKT);

  return(ZRPOS_PKT);

}



    ZModemReceive.prototype.Cancel = function (reason) {

        try {
            this._Connection.writeByte(this.CAN); // 001
            this._Connection.writeByte(this.CAN); // 002
            this._Connection.writeByte(this.CAN); // 003 
            this._Connection.writeByte(this.CAN); // 004
            this._Connection.writeByte(this.CAN); // 005
            console.log('Sent 5x Cancell to stop the Z-Modem Transfer');
            this._Connection.writeByte(this.CAN); // 005
            console.log('And enter sent');
            this._Connection.writeString("\n"); // 005
        } catch (ioe1) {
            console.log('ERROR: There was a problem in sending Cancell to stop the Z-Modem Transfer');
            this.HandleIOError(ioe1);
            return;
        }

        try {
            this._Connection.readString();
        } catch (ioe2) {
            this.HandleIOError(ioe2);
            return;
        }

        this.CleanUp('Cancelling (' + reason + ')');

    };

    ZModemReceive.prototype.CleanUp = function (message) {
        var _this = this;
        clearInterval(this._Timer);
        this.lblStatus.Text = 'Status: ' + message;
        setTimeout(function () { _this.Dispatch(); }, 3000);
    };

    ZModemReceive.prototype.Dispatch = function () {
        this.pnlMain.Hide();
        this._Crt.ShowCursor();
        this.ontransfercomplete.trigger();
    };

    ZModemReceive.prototype.Download = function () { // HERE
        var _this = this;
        this._Timer = setInterval(function () { _this.OnTimer(); }, 50);
        this._Crt.HideCursor();
        this.pnlMain = new CrtPanel(this._Crt, undefined, 10, 5, 60, 14, BorderStyle.Single, Crt.WHITE, Crt.BLACK, 'ZModem-G Receive Status (Hit CTRL+X to abort)', ContentAlignment.TopLeft);
        this.lblFileCount = new CrtLabel(this._Crt, this.pnlMain, 2, 2, 56, 'Receiving file 1', ContentAlignment.Left, Crt.LIGHTGRAY, Crt.BLACK);
        this.lblFileName = new CrtLabel(this._Crt, this.pnlMain, 2, 4, 56, 'File Name: ', ContentAlignment.Left, Crt.LIGHTGRAY, Crt.BLACK);
        this.lblFileSize = new CrtLabel(this._Crt, this.pnlMain, 2, 5, 56, 'File Size: ', ContentAlignment.Left, Crt.LIGHTGRAY, Crt.BLACK);
        this.lblFileReceived = new CrtLabel(this._Crt, this.pnlMain, 2, 6, 56, 'File Recv: ', ContentAlignment.Left, Crt.LIGHTGRAY, Crt.BLACK);
        this.pbFileReceived = new CrtProgressBar(this._Crt, this.pnlMain, 2, 7, 56, ProgressBarStyle.Continuous);
        this.lblTotalReceived = new CrtLabel(this._Crt, this.pnlMain, 2, 9, 56, 'Total Recv: ', ContentAlignment.Left, Crt.LIGHTGRAY, Crt.BLACK);
        this.lblStatus = new CrtLabel(this._Crt, this.pnlMain, 2, 11, 56, 'Status: Transferring file(s)', ContentAlignment.Left, Crt.WHITE, Crt.BLACK);
    };

    ZModemReceive.prototype.FileAt = function (index) {
        return this._Files[index];
    };

    Object.defineProperty(ZModemReceive.prototype, "FileCount", {
        get: function () {
            return this._Files.length;
        },
        enumerable: true,
        configurable: true
    });

    ZModemReceive.prototype.HandleIOError = function (ioe) {
        console.log('I/O Error: ' + ioe);
        if (this._Connection.connected) {
            this.CleanUp('Unhandled I/O error');
        }
        else {
            this.CleanUp('Connection to server lost');
        }
    };

    var RECV_ZRQINIT = 0;
    var RECV_ZQINIT = 0;
    var RECV_ZFILE = 0;
    var RECV_ZDATA = 0;

    var RECV_STEP = 0;

    ZModemReceive.prototype.OnTimer = function () {
        while (this._Crt.KeyPressed()) {
            var KPE = this._Crt.ReadKey();
            if ((typeof KPE !== 'undefined') && (KPE.keyString.length > 0) && (KPE.keyString.charCodeAt(0) === this.CAN)) {
                this.Cancel('User requested abort');
            }
        }
        //while (true) {
        if (RECV_STEP === 0) {
          if (this._NextByte === this.ZRQINIT) { // HERE
            try {
              this._Connection.writeString(this.getZRINIT()); // HERE WE SEND THE ZRINIT PACKET
              console.log('-> ZRINIT after received ZRQINIT ' + this.getZRINIT());
              this._Connection.flush();
              RECV_STEP = 1;
            } catch (ioe1) {
              this.HandleIOError(ioe1);
              console.log('ERROR: Cannot send ZRINIT after received ZRQINIT');
              return;
            }
            this._LastGTime = new Date().getTime();
          }
        }

        if (RECV_STEP === 1) {
          if (this._Connection.bytesAvailable !== 0) {
            var BlockSize = this._Connection.bytesAvailable;
            try {
              var c='X';
              var Packet = new ByteArray();
              this._Connection.readBytes(Packet, 0, BlockSize);
              c = this.hexToChar(Packet.readUnsignedByte()); // ZPAD
              c = this.hexToChar(Packet.readUnsignedByte()); // ZDLE
              c = this.hexToChar(Packet.readUnsignedByte()); // ZBIN
              c = this.hexToChar(Packet.readUnsignedByte()); // type
              c = this.hexToChar(Packet.readUnsignedByte()); // arg1
              c = this.hexToChar(Packet.readUnsignedByte()); // arg2
              c = this.hexToChar(Packet.readUnsignedByte()); // arg3
              c = this.hexToChar(Packet.readUnsignedByte()); // arg4
              c = this.hexToChar(Packet.readUnsignedByte()); // crc1
              c = this.hexToChar(Packet.readUnsignedByte()); // crc2
              c = this.hexToInt(Packet.readUnsignedByte()); // END OF HEADER
              // The CRC Check
              var FileName = '';
              var B = Packet.readUnsignedByte();
              while ((B !== 0) && (Packet.bytesAvailable > 0)) {
              FileName += String.fromCharCode(B);
                B = Packet.readUnsignedByte();
              }
              //B = Packet.readUnsignedByte(); // ??? THIS IS PROBABLY MISSING ON TEST #2
              // END OF FILENAME
              var Temp = '';
              var FileSize = 0;
              B = Packet.readUnsignedByte();
              while ((B >= 48) && (B <= 57) && (Packet.bytesAvailable > 0)) {
                Temp += String.fromCharCode(B);
                B = Packet.readUnsignedByte();
              }
              FileSize = parseInt(Temp, 10);
              // END OF FILESIZE
              console.log('FILENAME: ' + FileName + ' FILEZISE: ' + FileSize);
              if (FileName.length === 0) {
                this.CleanUp('File(s) successfully received!');
                return;
              }
              if (isNaN(FileSize) || (FileSize === 0)) {
                this.Cancel('File Size missing from header block');
                console.log('Bad File Size');
              }

              this._File = new FileRecord(FileName, FileSize);
              this.lblFileCount.Text = 'Receiving file ' + (this._Files.length + 1).toString();
              this.lblFileName.Text = 'File Name: ' + FileName;

              this.lblFileSize.Text = 'File Size: ' + StringUtils.AddCommas(FileSize) + ' bytes';
              this.lblFileReceived.Text = 'File Recv: 0 bytes';
              this.pbFileReceived.Value = 0;
              this.pbFileReceived.Maximum = FileSize;

              RECV_STEP=2;

              console.log(Packet.toString());

            } catch (ioe2) {
              this.HandleIOError(ioe2);
              return;
            }
          }

         if (RECV_STEP === 2) { // SEND ZRPOS

           this._Connection.writeString(this.getZRPOS(0)); // HERE WE SEND THE ZRINIT PACKET
           console.log("-> ZRPOS And Flushing Connection");
           RECV_STEP=3; // GO TO RECEIVE ZDATA
             
         }

         if (RECV_STEP === 3) { // RECEIVE ZDATA

           var BlockSize = this._Connection.bytesAvailable;
           console.log('AFTER ZRPOS BYTES AVAIL: '+BlockSize);
           try {
             this._Connection.readBytes(Packet, 0, 1);
           } catch (ioe1) {
             this.Cancel('NO ZDATA TO RECEIVE');
             //this.HandleIOError(ioe1);
             //return;
           }
         }

         console.log("<-- ZDATA Bytes Avail AFTER ZRPOS: " + this._Connection.bytesAvailable);

       }  

    };
    ZModemReceive.prototype.SaveFile = function (index) {
        var ByteString = this._Files[index].data.toString();
        var Buffer = new ArrayBuffer(ByteString.length);
        var View = new DataView(Buffer);
        for (var i = 0; i < ByteString.length; i++) {
            View.setUint8(i, ByteString.charCodeAt(i));
        }
        var FileBlob = new Blob([Buffer], { type: 'application/octet-binary' });
        saveAs(FileBlob, this._Files[index].name);
    };
    return ZModemReceive;
}());
