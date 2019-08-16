var readline = require('readline');

var CRC = (function () {
    function CRC() {
    }
    CRC.Calculate16 = function (bytes) {
        var CRC = 0;
        var OldPosition = bytes.position;
        bytes.position = 0;
        while (bytes.bytesAvailable > 0) {
            CRC = this.UpdateCrc(bytes.readUnsignedByte(), CRC);
        }
        CRC = this.UpdateCrc(0, CRC);
        CRC = this.UpdateCrc(0, CRC);
        bytes.position = OldPosition;
        return CRC;
    };
    CRC.UpdateCrc = function (curByte, curCrc) {
        return (this.CRC_TABLE[(curCrc >> 8) & 0x00FF] ^ (curCrc << 8) ^ curByte) & 0xFFFF;
    };
    return CRC;
}());
CRC.CRC_TABLE = [
    0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
    0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
    0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
    0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
    0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
    0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
    0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
    0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
    0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
    0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
    0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
    0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
    0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
    0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
    0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
    0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
    0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
    0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
    0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
    0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
    0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
    0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
    0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
    0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
    0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
    0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
    0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
    0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
    0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
    0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
    0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
    0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0
];

var ByteArray = (function () {
    function ByteArray() {
        this._Bytes = [];
        this._Length = 0;
        this._Position = 0;
    }
    Object.defineProperty(ByteArray.prototype, "bytesAvailable", {
        get: function () {
            return this._Length - this._Position;
        },
        enumerable: true,
        configurable: true
    });
    ByteArray.prototype.clear = function () {
        this._Bytes = [];
        this._Length = 0;
        this._Position = 0;
    };
    Object.defineProperty(ByteArray.prototype, "length", {
        get: function () {
            return this._Length;
        },
        set: function (value) {
            if (value <= 0) {
                this.clear();
            }
            else {
                if (value < this._Length) {
                    this._Bytes.splice(value, this._Length - value);
                }
                else if (value > this._Length) {
                    for (var i = this._Length + 1; i <= value; i++) {
                        this._Bytes.push(0);
                    }
                }
                this._Length = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ByteArray.prototype, "position", {
        get: function () {
            return this._Position;
        },
        set: function (value) {
            if (value <= 0) {
                value = 0;
            }
            else if (value >= this._Length) {
                value = this._Length;
            }
            this._Position = value;
        },
        enumerable: true,
        configurable: true
    });
    ByteArray.prototype.readBytes = function (bytes, offset, length) {
        if (typeof offset === 'undefined') {
            offset = 0;
        }
        if (typeof length === 'undefined') {
            length = 0;
        }
        if (this._Position + length > this._Length) {
            throw 'There is not sufficient data available to read.';
        }
        var BytesPosition = bytes.position;
        bytes.position = offset;
        for (var i = 0; i < length; i++) {
            bytes.writeByte(this._Bytes[this._Position++] & 0xFF);
        }
        bytes.position = BytesPosition;
    };
    ByteArray.prototype.readString = function (length) {
        if (typeof length === 'undefined') {
            length = this._Length;
        }
        var Result = '';
        while ((length-- > 0) && (this._Position < this._Length)) {
            Result += String.fromCharCode(this._Bytes[this._Position++]);
        }
        if (this.bytesAvailable === 0) {
            this.clear();
        }
        return Result;
    };
    ByteArray.prototype.readUnsignedByte = function () {
        if (this._Position >= this._Length) {
            throw 'There is not sufficient data available to read.';
        }
        return (this._Bytes[this._Position++] & 0xFF);
    };
    ByteArray.prototype.readUnsignedShort = function () {
        if (this._Position >= (this._Length - 1)) {
            throw 'There is not sufficient data available to read.';
        }
        return ((this._Bytes[this._Position++] & 0xFF) << 8) + (this._Bytes[this._Position++] & 0xFF);
    };
    ByteArray.prototype.toString = function () {
        var Result = '';
        for (var i = 0; i < this._Length; i++) {
            Result += String.fromCharCode(this._Bytes[i]);
        }
        return Result;
    };
    ByteArray.prototype.writeByte = function (value) {
        this._Bytes[this._Position++] = (value & 0xFF);
        if (this._Position > this._Length) {
            this._Length++;
        }
    };
    ByteArray.prototype.writeBytes = function (bytes, offset, length) {
        if (!offset) {
            offset = 0;
        }
        if (!length) {
            length = 0;
        }
        if (offset < 0) {
            offset = 0;
        }
        if (length < 0) {
            return;
        }
        else if (length === 0) {
            length = bytes.length;
        }
        if (offset >= bytes.length) {
            offset = 0;
        }
        if (length > bytes.length) {
            length = bytes.length;
        }
        if (offset + length > bytes.length) {
            length = bytes.length - offset;
        }
        var BytesPosition = bytes.position;
        bytes.position = offset;
        for (var i = 0; i < length; i++) {
            this.writeByte(bytes.readUnsignedByte());
        }
        bytes.position = BytesPosition;
    };
    ByteArray.prototype.writeShort = function (value) {
        this.writeByte((value & 0xFF00) >> 8);
        this.writeByte(value & 0x00FF);
    };
    ByteArray.prototype.writeString = function (text) {
        var Textlength = text.length;
        for (var i = 0; i < Textlength; i++) {
            this.writeByte(text.charCodeAt(i) & 0xFF);
        }
    };
    return ByteArray;
}());






  //ZModemReceive.prototype.getZRINIT = function(par_flag) {
  hexToBytes = function(hex) {
    //for (var bytes = [], c = 0; c < hex.length; c += 2)
    //for (var bytes = new ByteArray(), c = 0; c < hex.length; c += 2)
    pkt = new ByteArray();
    for (c=0;c<hex.length;c+=2) {
      pkt.writeByte(parseInt(hex.substr(c, 2), 16));
    }
    return(pkt);
  }

  function calcCRC(data) {
    var crc = 0;
    var d;
    data.position = 0;
    for (i = 0; i < data.length; i++) {
      d = data.readUnsignedByte();
      crc = crc ^ (d << 8);
      for (j = 0; j < 8; j++) {
        if ((crc & 0x8000) != 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc = (crc << 1);
        }
      }
    }
    return (crc & 0xFFFF);
  }

  IToChar = function(val) {
    return(val.toString());
  }

  IToHex4 = function(val) {
    var tmp = val.toString(16);
    var ret = ("000"+tmp).slice(-4).toLowerCase();
    return(ret);
  }

  IToHex8 = function(val) {
    var tmp = val.toString(16);
    var ret = ("0000000"+tmp).slice(-8).toLowerCase();
    return(ret);
  }

  IToHex = function(val) {
    var tmp = val.toString(16);
    var ret = ("0"+tmp).slice(-2).toLowerCase();
    return(ret);
  }


packetZFIN=function(position) {
  ZPAD='*'; // PAD CHAR
  ZDLE=String.fromCharCode(24); // ZDLE ESCAPE SEQ
  ZHEX='B'; // HEX HEADER
  CR=0x0D; // CARRIAGE RETURN
  LF=0x0A; // LINE FEED
  PTP=0x08; // PACKET TYPE [ ZFIN ]
  HDR=IToChar(ZPAD)+IToChar(ZPAD)+IToChar(ZDLE)+IToChar(ZHEX)+IToHex(PTP);
  DAT=IToHex8(0);
  END=IToHex(CR)+IToHex(LF);
  PKT=HDR+DAT+IToHex4(calcCRC(hexToBytes(HDR+DAT)))+END;
  return (PKT);
}

packetZRPOS=function(position) {
  ZPAD='*'; // PAD CHAR
  ZDLE=String.fromCharCode(24); // ZDLE ESCAPE SEQ
  ZHEX='B'; // HEX HEADER
  CR=0x0D; // CARRIAGE RETURN
  LF=0x0A; // LINE FEED
  PTP=0x09; // PACKET TYPE [ ZRPOS ]
  POS=position;
  HDR=IToChar(ZPAD)+IToChar(ZPAD)+IToChar(ZDLE)+IToChar(ZHEX)+IToHex(PTP);
  DAT=IToHex8(POS);
  END=IToHex(CR)+IToHex(LF);
  PKT=HDR+DAT+IToHex4(calcCRC(hexToBytes(HDR+DAT)))+END;
  return (PKT);
}

packetZRINIT=function(par_flag) {
  ZPAD='*'; // PAD CHAR
  ZDLE=String.fromCharCode(24); // ZDLE ESCAPE SEQ
  ZHEX='B'; // HEX HEADER
  CR=0x0D; // CARRIAGE RETURN
  LF=0x0A; // LINE FEED
  PKT_LEN=1024; // DATA SUBPACKET LENGTH
  PTP=0x01; // PACKET TYPE [ ZRINIT ]
  TRCAPA=0; // TRANSFER CAPABILITIES
  ZF1=TRCAPA >> 0x8; // ZF1
  ZF0=TRCAPA - ZF1 * 0xFF; // ZF0
  ZP1=PKT_LEN >> 0x8; // ZP1
  ZP0=PKT_LEN - ZP1 * 0xFF; // ZP0
  PKT_HDR=IToChar(ZPAD)+IToChar(ZPAD)+IToChar(ZDLE)+IToChar(ZHEX)+IToHex(PTP);
  PKT_DAT=IToHex(ZP0)+IToHex(ZP1)+IToHex(ZF1)+IToHex(ZF0);
  PKT_END=IToHex(CR)+IToHex(LF);
  PKT=PKT_HDR+PKT_DAT+IToHex4(calcCRC(hexToBytes(PKT_HDR+PKT_DAT)))+PKT_END;
  return (PKT);
}

  getZRPOS = function(position) {

    var ZPAD = '*';
    var ZDLE = String.fromCharCode(24);
    var ZHEX = 'B';
    var ZBIN = 'A';

    var CR = 0x0D;
    var LF = 0x0A;

    var PKT_LEN = 1024;
    var ZRPOS = 0x9;

    var PKT_TYPE = this.IToHex(ZRPOS);

    var hex_pos = this.IToHex8(position);

    var HEX_COMMON_HEADER=this.IToChar(ZPAD)+this.IToChar(ZPAD)+this.IToChar(ZDLE) +this.IToChar(ZHEX);

    var ZRPOS_PKT = HEX_COMMON_HEADER + PKT_TYPE + hex_pos;
    //var LF8 = 1 << 7; // SET THE EIGHT BIT //LF |= LF8;
    var END_OF_COMMAND = this.IToHex(CR) + this.IToHex(LF);

    var ZRPOS_PKT = ZRPOS_PKT + this.IToHex4(calcCRC(this.hexToBytes(ZRPOS_PKT)))  + END_OF_COMMAND;

    return(ZRPOS_PKT);

  }

  getZFIN = function(position) {

    var ZPAD = '*';
    var ZDLE = String.fromCharCode(24);
    var ZHEX = 'B';
    var ZBIN = 'A';

    var CR = 0x0D;
    var LF = 0x0A;

    var PKT_LEN = 1024;
    var ZFIN = 0x8;

    var PKT_TYPE = this.IToHex(ZFIN);

    var hex_pos = this.IToHex8(position);

    var HEX_COMMON_HEADER=this.IToChar(ZPAD)+this.IToChar(ZPAD)+this.IToChar(ZDLE) +this.IToChar(ZHEX);

    var ZRPOS_PKT = HEX_COMMON_HEADER + PKT_TYPE + hex_pos;
    //var LF8 = 1 << 7; // SET THE EIGHT BIT //LF |= LF8;
    var END_OF_COMMAND = this.IToHex(CR) + this.IToHex(LF);

    var ZRPOS_PKT = ZRPOS_PKT + this.IToHex4(calcCRC(this.hexToBytes(ZRPOS_PKT)))  + END_OF_COMMAND;

    return(ZRPOS_PKT);

  }


rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});


dumb = function() {
  var i=0;
} 

var resp_step=0;

function sleep(seconds) {
  require("child_process").execSync('sleep ' + seconds);
}

//
// PROBABLY READ IT AS DATA STREAM. Just Because the New Lines Cancells
// The possibility to get the correct bytes. 
// STEP 0: rz
// process.stderr.write("STEP 0: " + line + "\n"); 
//

rl.on('line', function(line) {

  if (resp_step===0) {
    process.stdout.write(packetZRINIT(0));
    process.stderr.write("STEP 0: " + line + "\n"); 
    sleep(1);
    resp_step++;
  }
  if (resp_step===1) {
    process.stdout.write(packetZRPOS(0));
    process.stderr.write("STEP 1: " + line + "\n"); 
    sleep(1);
    resp_step++;
  }
  if (resp_step===2) {
    process.stdout.write(packetZRINIT(0));
    process.stderr.write("STEP 2: " + line + "\n"); 
    sleep(1);
    resp_step++;
  } 
  if (resp_step===3) {
    process.stdout.write(packetZFIN(0));
    process.stderr.write("STEP 3: " + line + "\n"); 
    sleep(1);
    resp_step++;
  }
  if (resp_step===4) {
    //console.log("DONE");
    //process.stderr.write("DONE"); 
  }
})
