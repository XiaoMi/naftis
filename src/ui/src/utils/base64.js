// Copyright 2018 Naftis Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var BASE64_MAPPING = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
  'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
  'w', 'x', 'y', 'z', '0', '1', '2', '3',
  '4', '5', '6', '7', '8', '9', '+', '/'
]

/**
 *ascii convert to binary
 */
var _toBinary = function (ascii) {
  var binary = []
  while (ascii > 0) {
    var b = ascii % 2
    ascii = Math.floor(ascii / 2)
    binary.push(b)
  }
  /*
  var len = binary.length;
  if(6-len > 0){
    for(var i = 6-len ; i > 0 ; --i){
      binary.push(0);
    }
  } */
  binary.reverse()
  return binary
}

/**
 *binary convert to decimal
 */
var _toDecimal = function (binary) {
  var dec = 0
  var p = 0
  for (var i = binary.length - 1; i >= 0; --i) {
    var b = binary[i]
    if (b === 1) {
      dec += Math.pow(2, p)
    }
    ++p
  }
  return dec
}

/**
 *unicode convert to utf-8
 */
var _toUTF8Binary = function (c, binaryArray) {
  var mustLen = (8 - (c + 1)) + ((c - 1) * 6)
  var fatLen = binaryArray.length
  var diff = mustLen - fatLen
  while (--diff >= 0) {
    binaryArray.unshift(0)
  }
  var binary = []
  var _c = c
  while (--_c >= 0) {
    binary.push(1)
  }
  binary.push(0)
  var i = 0
  var len = 8 - (c + 1)
  for (; i < len; ++i) {
    binary.push(binaryArray[i])
  }

  for (var j = 0; j < c - 1; ++j) {
    binary.push(1)
    binary.push(0)
    var sum = 6
    while (--sum >= 0) {
      binary.push(binaryArray[i++])
    }
  }
  return binary
}

var BASE64 = {
  /**
   *BASE64 Encode
   */
  encoder: function (str) {
    var base64Index = []
    var binaryArray = []
    for (var i = 0, len1 = str.length; i < len1; ++i) {
      var unicode = str.charCodeAt(i)
      var _tmpBinary = _toBinary(unicode)
      if (unicode < 0x80) {
        var _tmpdiff = 8 - _tmpBinary.length
        while (--_tmpdiff >= 0) {
          _tmpBinary.unshift(0)
        }
        binaryArray = binaryArray.concat(_tmpBinary)
      } else if (unicode >= 0x80 && unicode <= 0x7FF) {
        binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary))
      } else if (unicode >= 0x800 && unicode <= 0xFFFF) { // UTF-8 3byte
        binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary))
      } else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) { // UTF-8 4byte
        binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary))
      } else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) { // UTF-8 5byte
        binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary))
      } else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) { // UTF-8 6byte
        binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary))
      }
    }

    var extraZeroCount = 0
    for (var y = 0, len2 = binaryArray.length; y < len2; y += 6) {
      var diff = (y + 6) - len2
      if (diff === 2) {
        extraZeroCount = 2
      } else if (diff === 4) {
        extraZeroCount = 4
      }
      var _tmpExtraZeroCount = extraZeroCount
      while (--_tmpExtraZeroCount >= 0) {
        binaryArray.push(0)
      }
      base64Index.push(_toDecimal(binaryArray.slice(y, y + 6)))
    }

    var base64 = ''
    for (var j = 0, len3 = base64Index.length; j < len3; ++j) {
      base64 += BASE64_MAPPING[base64Index[j]]
    }

    for (var k = 0, len4 = extraZeroCount / 2; k < len4; ++k) {
      base64 += '='
    }
    return base64
  },
  /**
   *BASE64  Decode for UTF-8
   */
  decoder: function (_base64Str) {
    var _len = _base64Str.length
    var extraZeroCount = 0
    if (_base64Str.charAt(_len - 1) === '=') {
      // alert(_base64Str.charAt(_len-1));
      // alert(_base64Str.charAt(_len-2));
      if (_base64Str.charAt(_len - 2) === '=') { // 两个等号说明补了4个0
        extraZeroCount = 4
        _base64Str = _base64Str.substring(0, _len - 2)
      } else { // 一个等号说明补了2个0
        extraZeroCount = 2
        _base64Str = _base64Str.substring(0, _len - 1)
      }
    }

    var binaryArray = []
    for (var i = 0, len = _base64Str.length; i < len; ++i) {
      var c = _base64Str.charAt(i)
      for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
        if (c === BASE64_MAPPING[j]) {
          var _tmp = _toBinary(j)
          /* 不足6位的补0 */
          var _tmpLen = _tmp.length
          if (6 - _tmpLen > 0) {
            for (var k = 6 - _tmpLen; k > 0; --k) {
              _tmp.unshift(0)
            }
          }
          binaryArray = binaryArray.concat(_tmp)
          break
        }
      }
    }

    if (extraZeroCount > 0) {
      binaryArray = binaryArray.slice(0, binaryArray.length - extraZeroCount)
    }

    var unicode = []
    var unicodeBinary = []
    for (var q = 0, len5 = binaryArray.length; q < len5;) {
      if (binaryArray[q] === 0) {
        unicode = unicode.concat(_toDecimal(binaryArray.slice(q, q + 8)))
        q += 8
      } else {
        var sum = 0
        while (q < len5) {
          if (binaryArray[q] === 1) {
            ++sum
          } else {
            break
          }
          ++q
        }
        unicodeBinary = unicodeBinary.concat(binaryArray.slice(q + 1, q + 8 - sum))
        q += 8 - sum
        while (sum > 1) {
          unicodeBinary = unicodeBinary.concat(binaryArray.slice(q + 2, q + 8))
          q += 8
          --sum
        }
        unicode = unicode.concat(_toDecimal(unicodeBinary))
        unicodeBinary = []
      }
    }
    return unicode
  }
}

module.exports = {
  base64: BASE64
}
