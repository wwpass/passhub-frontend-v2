/*
 * password-generator
 * Copyright(c) 2011-2020 Bermi Ferrer <bermi@bermilabs.com>
 * MIT Licensed
 */


    var localName, consonant, letter, password, vowel, rand, getRandomValues;
    letter = /[a-z]$/i;
    vowel = /[aeiou]$/i;
    consonant = /[bcdfghjklmnpqrstvwxyz]$/i;
  
  
    // Defines the name of the local variable the passwordGenerator library will use
    // this is specially useful if window.passwordGenerator is already being used
    // by your application and you want a different name. For example:
    //    // Declare before including the passwordGenerator library
    //    var localPasswordGeneratorLibraryName = 'pass';
    localName = window.localPasswordGeneratorLibraryName || "generatePassword";
  
    password = function (length, memorable, pattern, prefix) {
      var char = "", n, i, validChars = [];
      if (length === null || typeof(length) === "undefined") {
        length = 10;
      }
      if (memorable === null || typeof(memorable) === "undefined") {
        memorable = true;
      }
      if (pattern === null || typeof(pattern) === "undefined") {
        pattern = /\w/;
      }
      if (prefix === null || typeof(prefix) === "undefined") {
        prefix = '';
      }
  
      // Non memorable passwords will pick characters from a pre-generated
      // list of characters
      if (!memorable) {
        for (i = 33; i <= 126; i += 1) {
          char = String.fromCharCode(i);
          if (char.match(pattern)) {
            validChars.push(char);
          }
        }
  
        if (!validChars.length) {
          throw new Error("Could not find characters that match the " +
            "password pattern " + pattern + ". Patterns must match individual " +
            "characters, not the password as a whole.");
        }
      }
  
  
      while (prefix.length < length) {
        if (memorable) {
          if (prefix.match(consonant)) {
            pattern = vowel;
          } else {
            pattern = consonant;
          }
          n = rand(33, 126);
          char = String.fromCharCode(n);
        } else {
          char = validChars[rand(0, validChars.length)];
        }
  
        if (memorable) {
          char = char.toLowerCase();
        }
        if (char.match(pattern)) {
          prefix = "" + prefix + char;
        }
      }
      return prefix;
    };
  
  
    rand = function (min, max) {
      var key, value, arr = new Uint8Array(max);
      getRandomValues(arr);
      for (key in arr) {
        if (arr.hasOwnProperty(key)) {
          value = arr[key];
          if (value >= min && value < max) {
            return value;
          }
        }
      }
      return rand(min, max);
    };
  
  
    getRandomValues = function (buf) {
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(buf);
      } else if (typeof window.msCrypto === "object" && typeof window.msCrypto.getRandomValues === 'function') {
        window.msCrypto.getRandomValues(buf);
      } else {
        throw new Error("No secure random number generator available.");
      }
    };
  
    export default password;
  
  