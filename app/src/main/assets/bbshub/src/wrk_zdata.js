// GNU Affero General Public License v3.0

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


// ZMODEM INIT PACKET (c) 2019 --

  function IToChar(val) {
    return(val.toString());
  }
  
  function IToHex4(val) {
    var tmp = val.toString(16);
    var ret = ("000"+tmp).slice(-4).toUpperCase();
    return(ret);
  }

  function IToHex(val) {
    var tmp = val.toString(16);
    var ret = ("0"+tmp).slice(-2).toUpperCase();
    return(ret);
  }

  hexToBytesSpace = function(hex) {
    //for (var bytes = [], c = 0; c < hex.length; c += 2)
    //for (var bytes = new ByteArray(), c = 0; c < hex.length; c += 2)
    pkt = new ByteArray();
    for (c=0;c<hex.length;c+=3) {
      pkt.writeByte(parseInt(hex.substr(c, 3), 16)); 
    }
    return(pkt);
  }

  hexToBytes = function(hex) {
    //for (var bytes = [], c = 0; c < hex.length; c += 2)
    //for (var bytes = new ByteArray(), c = 0; c < hex.length; c += 2)
    pkt = new ByteArray();
    for (c=0;c<hex.length;c+=2) {
      pkt.writeByte(parseInt(hex.substr(c, 2), 16)); 
    }
    return(pkt);
  }


function getZRINIT() {

  var ZPAD = '*';
  var ZDLE = String.fromCharCode(24);
  var ZHEX = 'B';
 
  var XON = 0x011;
  var XOFF = 0x013;
  var CR = 0x0D;
  var LF = 0x0A;
  
  
  var HEX_COMMON_HEADER = IToChar(ZPAD) + IToChar(ZPAD) + IToChar(ZDLE) + IToChar(ZHEX);
  
  var PKT_LEN = 1024;
  var ZRINIT = 1;
  
  var PKT_TYPE = ZRINIT;
  var TRCAPA = 0; // TRANSFER CAPABILITIES
  
  var TRPFORT = TRCAPA >> 0x8; // A2
  var TRPFAIBLE =  TRCAPA - TRPFORT * 256; // A3
  var BLFORT = PKT_LEN >> 0x8; // A1
  var BLFAIBLE = PKT_LEN - BLFORT * 256; // A0
  
  var ZRINIT = HEX_COMMON_HEADER + IToHex(PKT_TYPE) + IToHex(BLFAIBLE) + IToHex(BLFORT) + IToHex(TRPFAIBLE) + IToHex(TRPFAIBLE);
  var END_OF_COMMAND = IToHex(CR) + IToHex(LF) + IToHex(XON);
  var ZRINIT_PKT = ZRINIT + IToHex4(CRC.Calculate16(hexToBytes(ZRINIT))) + END_OF_COMMAND;

  //console.log(hexToBytes(ZRINIT));
  //console.log(CRC.Calculate16(hexToBytes((ZRINIT))));

  return (ZRINIT_PKT);

}

bytesUnescape = function(array) {

  try {

    var unesc = new ByteArray();
    var byte;
    pos=0;
    array.position=0;
    unesc.position=0;

    while (array.bytesAvailable > 0)  {
      byt = array.readUnsignedByte();
      if (byt === 24) { // ZDLE 0x18
        if (array.bytesAvailable == 0) { break; }  
        byt = array.readUnsignedByte();
        if (byt==109) { // 0xFF
          byt=255;
         } else if (byt==41)  {
           byt=127; // 0x7F 
         } else {
           byt = byt ^ 64;
         }
       }
       unesc.writeByte(byt);
       pos++;
     }
     unesc.position = pos;
   } catch(esc) {
     console.log('EXCEPTION: ' + pos + ' UNESC ' + unesc + ' AVAIL: ' + array.bytesAvailable);
   }
   return(unesc);
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
// console.log(getZRINIT());
//
// var crcHex = "2a 18 41 0a 00 00 00 00 46 ae 50 4b 03 04 14 00 02 00 08 00 4f 07 97 19 cb bd b7 f7 06 14 00 00 dc 2d 00 00 08 00 00 00 43 52 45 57 2e 54 58 54 ad 3a 6b 73 e3 36 92 df 59 c5 18 6d d0 c5 0f 67 e9 4a d6 c4 18 d3 9d db 5b a7 ae 66 e5 e7 78 c6 af 58 9a f8 b6 52 5b 1b 88 84 44 44 24 c0 00 a0 35 9a 9a 1f 7f dd 0d 18 d0 96 6d 39 9b ab 8a 92 b1 44 02 68 f4 fb 05 40 fc 5c 5e 4c 67 70 73 06 d7 18 d3 ab d3 e9 08 ee 26 d7 9f f0 6b 72 7d 02 d3 d3 bb 8b c9 25 5c 7f be 3a 3a bd 9b c2 80 de 1d df 9d de c3 c9 64 36 19 a6 09 bc f6 19 54 c2 79 68 9b 42 78 59 c0 5f df 1c bc 7b f3 b7 b7 b8 20 4d 66 a5 72 d0 18 58 e7 95 5e 02 fe 54 da 4b 5d e0 24 6f 20 6f 3d 14 66 ad c1 68 00 5f 4a c8 cc 02 47 01 84 5b e1 8c df 5a 89 cb 8c 76 19 88 b9 69 7d 9a d0 9c 53 04 60 1b ab 9c 04 c8 ad 5c d3 4a e1 01 9c 94 35 18 50 54 dc ad 01 c4 05 40 3e 48 bb 01 58 d0 24 a8 8d f6 a5 03 44 80 f7 4a 18 53 2b f3 b1 b0 de 8d 9d c7 2f 2b 57 e3 5a b9 1c b4 5c bb a5 35 6d 33 26 c2 2e 18 50 32 62 8d 18 58 e2 76 66 81 a8 01 e8 b6 9e 4b 4b 4f 8d b4 ca 14 2a 4f 18 d3 48 61 20 35 50 67 c7 62 ec c6 18 6d 49 4c b8 ad a4 40 7c ad 5c e0 3a 1c 62 5a cf 26 3f 5e 1e 3e 4a e3 16 79 7f 73 72 71 0c b7 37 d3 8b eb f3 29 cc 6e 3a 18 50 70 7d 7a 3f 3d bf bb f9 7c 3b cd d2 04 18 d1 55 79 25 61 61 2c 62 b3 68 ab 0a 2a 85 dc df c2 a7 63 b8 1b 21 c2 9a b1 79 b2 67 b7 69 9a 4c 8e ef 6e ae 18 6d 71 35 45 16 6f 83 cd ad d1 9b da 41 eb 18 d0 16 e4 98 27 29 12 24 83 60 6c 0f 7e 4c c4 fd cf 9f f7 49 18 53 38 18 58 c2 b5 a8 a5 83 c1 27 65 57 23 98 36 26 c7 af ab fc d8 6c 46 70 22 bc 18 58 c1 4f 6d 95 0b 8d c4 49 9f 18 d3 56 be 1d c2 9d d0 2b 87 3f bf 1f c2 31 29 c5 5c e4 2b 92 a2 2e dc 9f 8c 21 21 48 86 73 48 b4 1f 88 21 18 50 9e 7b 0e 6a 55 14 c8 3e a5 95 57 a2 7a 18 53 1f 35 d2 32 66 35 42 06 2e a5 96 56 54 d5 06 a5 b2 b4 92 d4 84 54 37 00 48 18 53 16 25 2d a0 b9 d9 47 e6 c2 4c cd 51 a6 ad e3 49 59 80 b4 16 0e 8c 46 28 4b f5 20 35 88 7e 32 cc 70 02 4f 4c 18 53 14 da ec 66 3a 0a 62 ef a0 64 50 a8 42 ef 79 c8 0d ee 22 98 3f d0 6a af 2a 98 4d a6 30 c8 8e 64 9d 0d 83 ca e0 3a 6d 1e 64 45 42 be d0 18 d0 dd a3 e0 25 5c 1b b8 12 1a e0 03 ee 7a ce 46 71 24 17 c6 ca 6c 04 e7 82 8c ed 4a f9 bc 94 48 48 2d 56 84 92 80 a5 15 0f d2 79 9a 8c 33 d3 84 18 50 0c 84 3b b1 e9 71 bf eb 50 27 95 6d 1a 61 a5 f6 48 e2 9c a1 03 9c 23 eb a0 14 05 d9 b9 f7 15 b2 ce 20 e5 69 b2 c5 66 18 58 18 58 d6 4c a7 e6 b8 b0 b1 c6 2c c2 36 8c 18 58 31 6d 21 54 45 6e 08 7f 22 5a a6 18 58 b2 fe 1e cc 87 41 cb 50 88 41 bd 03 b4 8d 69 18 d1 4f 6d c5 0c 43 70 1a b9 95 a3 6c fc 88 00 20 7b bc a9 02 9f e6 95 d1 05 89 3e 4d 32 f6 77 53 85 8f b8 fd ad b0 a2 50 4e 22 4f 95 23 30 41 62 41 36 80 e8 ce ce a6 8f da c1 63 34 48 ac 22 4e d5 44 3a 53 81 7b 18 58 b3 72 a0 16 c0 68 21 7b c8 a8 e7 b2 52 f2 41 d2 84 1a e1 4c f2 dc d8 82 28 ec 9c cc cd 62 a1 72 69 49 bb 50 6c ad a8 60 40 c2 45 6a e6 82 b8 64 ac 5a 2a cd 4e 1b 16 d6 d4 70 32 3e 26 bf 77 66 b4 17 5a 0c 51 18 58 8a 18 d1 fb 5f 5f 37 d6 7d d5 7e 5d 2d 8a 34 19 f4 fc 28 60 ad 7c 09 4e 7d 01 b7 a9 2a 84 2a 5d e0 2b 29 cd 47 d3 5a 2d 37 84 ce 18 d1 40 6c 33 c2 ca 4a e4 34 7b 14 f9 25 2f 85 5e ca c3 18 58 5a 48 01 c8 3d 5d 59 37 86 a9 20 9f 3c 1e c7 b1 49 8d 98 8b c3 f8 3d 86 8b bd 1a c4 c2 0a 55 30 4b 7e ce 05 32 f8 fd 3f b7 24 18 6b cb c1 11";
// PKT #1
// var 0x00 : 2a 18 41 0a 00 00 00 00 46 ae 00 18 68 ed ae 2a 18 41 0b 01 00 00 00 9a 4
// var 0x01 : 2a 18 41 0a 00 00 00 00 46 ae 01 18 68 de 9f 2a 18 41 0b 01 00 00 00 9a 4
// var crcHex = "2a 18 41 0b 01 00 00 00"; //  46 ae 00 ";
// var crcHex = "2a 18 41 0b 01 00 00 00"; //  46 ae 00 ";
//  var crcHex = "2a 18 41 0b 01 00 00 00"; //  46 ae 00 ";
// var crcHex = "2a 18 41 0a 00 00 00 00 46 ae 31 32 33 0a"; // lsz
// var crcHex = "2a 18 41 0a 00 00 00 00 46 ae 31 32 33 0a";
// var 0x00 : 2a 18 41 0a 00 00 00 00 46 ae 00 18 68 ed ae 2a 18 41 0b 01 00 00 00 9a 4
// ZCRCE
// 18 68 f9 ae

// LSZ H00
// 18 41 0a 00 00 00 00 46 ae 00 
// 18 41 0a 00 00 00 00 46 ae 01
// 18 68 ed ae
// 2a 18 41 0b 01 00 00 00 9a 4b

// LSZ H01
// 18 41 0a 00 00 00 00 46 ae 01
// var crcHex = "2a 18 41 0a 00 00 00 00 46 ae 01";
// var crcHex = "2a 18 41 0a 00 00 00 00 46 ae 01";
// var crcHex = "41 0a 00 00 00 00 46 ae 01";
// Possibly 7 bytes from header type
// var crcHex = "41 0a 00 00 00 00 46 ae";
// var crcHex = "21 18 42 0a 00 00 00 00 46 ae";
//var crcHex = "41 0a 00 00 00 00 46 ae 01";
var crcHex = "2a 18 41 0a 00 00 00 00 46 ae 00"

/*
crcSub = crcHex.substr(0,12);
crcSubBytes = hexToBytesSpace(crcSub);
crcSubHex = CRC.Calculate16(crcSubBytes);
crcSubHexE = crcSubHex ^ 64;
console.log(IToHex4(crcSubHex)); // + ' ' + IToHex4(crcSubHexE) + ' ' + crcSub);
*/

for (i=0;i<13*3;i=i+3) {
  crcSub = crcHex.substr(0,i);
  crcSubBytes = hexToBytesSpace(crcSub);
  crcSubHex = CRC.Calculate16(crcSubBytes);
  crcSubHexE = crcSubHex ^ 64;
  console.log(IToHex4(crcSubHex) + ' ' + IToHex4(crcSubHexE) + ' ' + crcSub);
}

for (i=0;i<13*3;i=i+3) {
  crcSub = crcHex.substr(i,13*3);
  crcSubBytes = hexToBytesSpace(crcSub);
  crcSubHex = CRC.Calculate16(crcSubBytes);
  crcSubHexE = crcSubHex ^ 64;
  console.log(IToHex4(crcSubHex) + ' ' + IToHex4(crcSubHexE) + ' ' + crcSub);
}


///for (i=11*3;i>=0;i=i-3) {
///  crcSub = crcHex.substr(0,i);
///  crcSubBytes = hexToBytesSpace(crcSub);
///  crcSubHex = CRC.Calculate16(crcSubBytes);
///  crcSubHexE = crcSubHex ^ 64;
///  console.log(IToHex4(crcSubHex) + ' ' + IToHex4(crcSubHexE) + ' ' + crcSub);
///}
///
///for (i=0;i<11*3-7;i=i+3) {
///  crcSub = crcHex.substr(i,i+7);
///  crcSubBytes = hexToBytesSpace(crcSub);
///  crcSubHex = CRC.Calculate16(crcSubBytes);
///  crcSubHexE = crcSubHex ^ 64;
///  console.log(IToHex4(crcSubHex) + ' ' + IToHex4(crcSubHexE) + ' ' + crcSub);
///}

// 18 68 de 9f
//
// No padding is used with binary data subpackets. The data bytes are ZDLE
// encoded and transmitted. A ZDLE and frameend are then sent, followed by
// two or four ZDLE encoded CRC bytes. The CRC accumulates the data bytes and
// frameend.
//

var crcBytes = hexToBytesSpace(crcHex);
var crc = CRC.Calculate16(crcBytes);

crct = IToHex4(0xEDAE); // H00
console.log("crc dec " + IToHex4(crct));
//crct = IToHex4(0xDE9F); // H01

console.log(crct[0] + crct[3] + crct[1] + crct[2]);

//console.log("crc dec " + IToHex4(crct));

//  CRCCheckBytes (2 bytes): A 16-bit CRC check field. For information
//
//  on the polynomial used for 16-bit CRC calculation, see ITU-T
//  Recommendation V.41, "Code-independent error-control system,"
//  November 1989.
//
