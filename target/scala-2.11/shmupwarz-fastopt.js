(function(){
'use strict';
/* Scala.js runtime support
 * Copyright 2013 LAMP/EPFL
 * Author: Sébastien Doeraene
 */

/* ---------------------------------- *
 * The top-level Scala.js environment *
 * ---------------------------------- */





// Get the environment info
var $env = (typeof __ScalaJSEnv === "object" && __ScalaJSEnv) ? __ScalaJSEnv : {};

// Global scope
var $g =
  (typeof $env["global"] === "object" && $env["global"])
    ? $env["global"]
    : ((typeof global === "object" && global && global["Object"] === Object) ? global : this);
$env["global"] = $g;

// Where to send exports
var $e =
  (typeof $env["exportsNamespace"] === "object" && $env["exportsNamespace"])
    ? $env["exportsNamespace"] : $g;
$env["exportsNamespace"] = $e;

// Freeze the environment info
$g["Object"]["freeze"]($env);

// Linking info - must be in sync with scala.scalajs.runtime.LinkingInfo
var $linkingInfo = {
  "envInfo": $env,
  "semantics": {




    "asInstanceOfs": 1,










    "moduleInit": 2,





    "strictFloats": false,




    "productionMode": false

  },



  "assumingES6": false,

  "linkerVersion": "0.6.11"
};
$g["Object"]["freeze"]($linkingInfo);
$g["Object"]["freeze"]($linkingInfo["semantics"]);

// Snapshots of builtins and polyfills






var $imul = $g["Math"]["imul"] || (function(a, b) {
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
  var ah = (a >>> 16) & 0xffff;
  var al = a & 0xffff;
  var bh = (b >>> 16) & 0xffff;
  var bl = b & 0xffff;
  // the shift by 0 fixes the sign on the high part
  // the final |0 converts the unsigned value into a signed value
  return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
});

var $fround = $g["Math"]["fround"] ||









  (function(v) {
    return +v;
  });


var $clz32 = $g["Math"]["clz32"] || (function(i) {
  // See Hacker's Delight, Section 5-3
  if (i === 0) return 32;
  var r = 1;
  if ((i & 0xffff0000) === 0) { i <<= 16; r += 16; };
  if ((i & 0xff000000) === 0) { i <<= 8; r += 8; };
  if ((i & 0xf0000000) === 0) { i <<= 4; r += 4; };
  if ((i & 0xc0000000) === 0) { i <<= 2; r += 2; };
  return r + (i >> 31);
});


// Other fields

















var $lastIDHash = 0; // last value attributed to an id hash code



var $idHashCodeMap = $g["WeakMap"] ? new $g["WeakMap"]() : null;



// Core mechanism

var $makeIsArrayOfPrimitive = function(primitiveData) {
  return function(obj, depth) {
    return !!(obj && obj.$classData &&
      (obj.$classData.arrayDepth === depth) &&
      (obj.$classData.arrayBase === primitiveData));
  }
};


var $makeAsArrayOfPrimitive = function(isInstanceOfFunction, arrayEncodedName) {
  return function(obj, depth) {
    if (isInstanceOfFunction(obj, depth) || (obj === null))
      return obj;
    else
      $throwArrayCastException(obj, arrayEncodedName, depth);
  }
};


/** Encode a property name for runtime manipulation
  *  Usage:
  *    env.propertyName({someProp:0})
  *  Returns:
  *    "someProp"
  *  Useful when the property is renamed by a global optimizer (like Closure)
  *  but we must still get hold of a string of that name for runtime
  * reflection.
  */
var $propertyName = function(obj) {
  for (var prop in obj)
    return prop;
};

// Runtime functions

var $isScalaJSObject = function(obj) {
  return !!(obj && obj.$classData);
};


var $throwClassCastException = function(instance, classFullName) {




  throw new $c_sjsr_UndefinedBehaviorError().init___jl_Throwable(
    new $c_jl_ClassCastException().init___T(
      instance + " is not an instance of " + classFullName));

};

var $throwArrayCastException = function(instance, classArrayEncodedName, depth) {
  for (; depth; --depth)
    classArrayEncodedName = "[" + classArrayEncodedName;
  $throwClassCastException(instance, classArrayEncodedName);
};


var $noIsInstance = function(instance) {
  throw new $g["TypeError"](
    "Cannot call isInstance() on a Class representing a raw JS trait/object");
};

var $makeNativeArrayWrapper = function(arrayClassData, nativeArray) {
  return new arrayClassData.constr(nativeArray);
};

var $newArrayObject = function(arrayClassData, lengths) {
  return $newArrayObjectInternal(arrayClassData, lengths, 0);
};

var $newArrayObjectInternal = function(arrayClassData, lengths, lengthIndex) {
  var result = new arrayClassData.constr(lengths[lengthIndex]);

  if (lengthIndex < lengths.length-1) {
    var subArrayClassData = arrayClassData.componentData;
    var subLengthIndex = lengthIndex+1;
    var underlying = result.u;
    for (var i = 0; i < underlying.length; i++) {
      underlying[i] = $newArrayObjectInternal(
        subArrayClassData, lengths, subLengthIndex);
    }
  }

  return result;
};

var $objectToString = function(instance) {
  if (instance === void 0)
    return "undefined";
  else
    return instance.toString();
};

var $objectGetClass = function(instance) {
  switch (typeof instance) {
    case "string":
      return $d_T.getClassOf();
    case "number": {
      var v = instance | 0;
      if (v === instance) { // is the value integral?
        if ($isByte(v))
          return $d_jl_Byte.getClassOf();
        else if ($isShort(v))
          return $d_jl_Short.getClassOf();
        else
          return $d_jl_Integer.getClassOf();
      } else {
        if ($isFloat(instance))
          return $d_jl_Float.getClassOf();
        else
          return $d_jl_Double.getClassOf();
      }
    }
    case "boolean":
      return $d_jl_Boolean.getClassOf();
    case "undefined":
      return $d_sr_BoxedUnit.getClassOf();
    default:
      if (instance === null)
        return instance.getClass__jl_Class();
      else if ($is_sjsr_RuntimeLong(instance))
        return $d_jl_Long.getClassOf();
      else if ($isScalaJSObject(instance))
        return instance.$classData.getClassOf();
      else
        return null; // Exception?
  }
};

var $objectClone = function(instance) {
  if ($isScalaJSObject(instance) || (instance === null))
    return instance.clone__O();
  else
    throw new $c_jl_CloneNotSupportedException().init___();
};

var $objectNotify = function(instance) {
  // final and no-op in java.lang.Object
  if (instance === null)
    instance.notify__V();
};

var $objectNotifyAll = function(instance) {
  // final and no-op in java.lang.Object
  if (instance === null)
    instance.notifyAll__V();
};

var $objectFinalize = function(instance) {
  if ($isScalaJSObject(instance) || (instance === null))
    instance.finalize__V();
  // else no-op
};

var $objectEquals = function(instance, rhs) {
  if ($isScalaJSObject(instance) || (instance === null))
    return instance.equals__O__Z(rhs);
  else if (typeof instance === "number")
    return typeof rhs === "number" && $numberEquals(instance, rhs);
  else
    return instance === rhs;
};

var $numberEquals = function(lhs, rhs) {
  return (lhs === rhs) ? (
    // 0.0.equals(-0.0) must be false
    lhs !== 0 || 1/lhs === 1/rhs
  ) : (
    // are they both NaN?
    (lhs !== lhs) && (rhs !== rhs)
  );
};

var $objectHashCode = function(instance) {
  switch (typeof instance) {
    case "string":
      return $m_sjsr_RuntimeString$().hashCode__T__I(instance);
    case "number":
      return $m_sjsr_Bits$().numberHashCode__D__I(instance);
    case "boolean":
      return instance ? 1231 : 1237;
    case "undefined":
      return 0;
    default:
      if ($isScalaJSObject(instance) || instance === null)
        return instance.hashCode__I();

      else if ($idHashCodeMap === null)
        return 42;

      else
        return $systemIdentityHashCode(instance);
  }
};

var $comparableCompareTo = function(instance, rhs) {
  switch (typeof instance) {
    case "string":

      $as_T(rhs);

      return instance === rhs ? 0 : (instance < rhs ? -1 : 1);
    case "number":

      $as_jl_Number(rhs);

      return $m_jl_Double$().compare__D__D__I(instance, rhs);
    case "boolean":

      $asBoolean(rhs);

      return instance - rhs; // yes, this gives the right result
    default:
      return instance.compareTo__O__I(rhs);
  }
};

var $charSequenceLength = function(instance) {
  if (typeof(instance) === "string")

    return $uI(instance["length"]);



  else
    return instance.length__I();
};

var $charSequenceCharAt = function(instance, index) {
  if (typeof(instance) === "string")

    return $uI(instance["charCodeAt"](index)) & 0xffff;



  else
    return instance.charAt__I__C(index);
};

var $charSequenceSubSequence = function(instance, start, end) {
  if (typeof(instance) === "string")

    return $as_T(instance["substring"](start, end));



  else
    return instance.subSequence__I__I__jl_CharSequence(start, end);
};

var $booleanBooleanValue = function(instance) {
  if (typeof instance === "boolean") return instance;
  else                               return instance.booleanValue__Z();
};

var $numberByteValue = function(instance) {
  if (typeof instance === "number") return (instance << 24) >> 24;
  else                              return instance.byteValue__B();
};
var $numberShortValue = function(instance) {
  if (typeof instance === "number") return (instance << 16) >> 16;
  else                              return instance.shortValue__S();
};
var $numberIntValue = function(instance) {
  if (typeof instance === "number") return instance | 0;
  else                              return instance.intValue__I();
};
var $numberLongValue = function(instance) {
  if (typeof instance === "number")
    return $m_sjsr_RuntimeLong$().fromDouble__D__sjsr_RuntimeLong(instance);
  else
    return instance.longValue__J();
};
var $numberFloatValue = function(instance) {
  if (typeof instance === "number") return $fround(instance);
  else                              return instance.floatValue__F();
};
var $numberDoubleValue = function(instance) {
  if (typeof instance === "number") return instance;
  else                              return instance.doubleValue__D();
};

var $isNaN = function(instance) {
  return instance !== instance;
};

var $isInfinite = function(instance) {
  return !$g["isFinite"](instance) && !$isNaN(instance);
};

var $doubleToInt = function(x) {
  return (x > 2147483647) ? (2147483647) : ((x < -2147483648) ? -2147483648 : (x | 0));
};

/** Instantiates a JS object with variadic arguments to the constructor. */
var $newJSObjectWithVarargs = function(ctor, args) {
  // This basically emulates the ECMAScript specification for 'new'.
  var instance = $g["Object"]["create"](ctor.prototype);
  var result = ctor["apply"](instance, args);
  switch (typeof result) {
    case "string": case "number": case "boolean": case "undefined": case "symbol":
      return instance;
    default:
      return result === null ? instance : result;
  }
};

var $resolveSuperRef = function(initialProto, propName) {
  var getPrototypeOf = $g["Object"]["getPrototypeOf"];
  var getOwnPropertyDescriptor = $g["Object"]["getOwnPropertyDescriptor"];

  var superProto = getPrototypeOf(initialProto);
  while (superProto !== null) {
    var desc = getOwnPropertyDescriptor(superProto, propName);
    if (desc !== void 0)
      return desc;
    superProto = getPrototypeOf(superProto);
  }

  return void 0;
};

var $superGet = function(initialProto, self, propName) {
  var desc = $resolveSuperRef(initialProto, propName);
  if (desc !== void 0) {
    var getter = desc["get"];
    if (getter !== void 0)
      return getter["call"](self);
    else
      return desc["value"];
  }
  return void 0;
};

var $superSet = function(initialProto, self, propName, value) {
  var desc = $resolveSuperRef(initialProto, propName);
  if (desc !== void 0) {
    var setter = desc["set"];
    if (setter !== void 0) {
      setter["call"](self, value);
      return void 0;
    }
  }
  throw new $g["TypeError"]("super has no setter '" + propName + "'.");
};

var $propertiesOf = function(obj) {
  var result = [];
  for (var prop in obj)
    result["push"](prop);
  return result;
};

var $systemArraycopy = function(src, srcPos, dest, destPos, length) {
  var srcu = src.u;
  var destu = dest.u;
  if (srcu !== destu || destPos < srcPos || srcPos + length < destPos) {
    for (var i = 0; i < length; i++)
      destu[destPos+i] = srcu[srcPos+i];
  } else {
    for (var i = length-1; i >= 0; i--)
      destu[destPos+i] = srcu[srcPos+i];
  }
};

var $systemIdentityHashCode =

  ($idHashCodeMap !== null) ?

  (function(obj) {
    switch (typeof obj) {
      case "string": case "number": case "boolean": case "undefined":
        return $objectHashCode(obj);
      default:
        if (obj === null) {
          return 0;
        } else {
          var hash = $idHashCodeMap["get"](obj);
          if (hash === void 0) {
            hash = ($lastIDHash + 1) | 0;
            $lastIDHash = hash;
            $idHashCodeMap["set"](obj, hash);
          }
          return hash;
        }
    }

  }) :
  (function(obj) {
    if ($isScalaJSObject(obj)) {
      var hash = obj["$idHashCode$0"];
      if (hash !== void 0) {
        return hash;
      } else if (!$g["Object"]["isSealed"](obj)) {
        hash = ($lastIDHash + 1) | 0;
        $lastIDHash = hash;
        obj["$idHashCode$0"] = hash;
        return hash;
      } else {
        return 42;
      }
    } else if (obj === null) {
      return 0;
    } else {
      return $objectHashCode(obj);
    }

  });

// is/as for hijacked boxed classes (the non-trivial ones)

var $isByte = function(v) {
  return (v << 24 >> 24) === v && 1/v !== 1/-0;
};

var $isShort = function(v) {
  return (v << 16 >> 16) === v && 1/v !== 1/-0;
};

var $isInt = function(v) {
  return (v | 0) === v && 1/v !== 1/-0;
};

var $isFloat = function(v) {



  return typeof v === "number";

};


var $asUnit = function(v) {
  if (v === void 0 || v === null)
    return v;
  else
    $throwClassCastException(v, "scala.runtime.BoxedUnit");
};

var $asBoolean = function(v) {
  if (typeof v === "boolean" || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Boolean");
};

var $asByte = function(v) {
  if ($isByte(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Byte");
};

var $asShort = function(v) {
  if ($isShort(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Short");
};

var $asInt = function(v) {
  if ($isInt(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Integer");
};

var $asFloat = function(v) {
  if ($isFloat(v) || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Float");
};

var $asDouble = function(v) {
  if (typeof v === "number" || v === null)
    return v;
  else
    $throwClassCastException(v, "java.lang.Double");
};


// Unboxes


var $uZ = function(value) {
  return !!$asBoolean(value);
};
var $uB = function(value) {
  return $asByte(value) | 0;
};
var $uS = function(value) {
  return $asShort(value) | 0;
};
var $uI = function(value) {
  return $asInt(value) | 0;
};
var $uJ = function(value) {
  return null === value ? $m_sjsr_RuntimeLong$().Zero$1
                        : $as_sjsr_RuntimeLong(value);
};
var $uF = function(value) {
  /* Here, it is fine to use + instead of fround, because asFloat already
   * ensures that the result is either null or a float.
   */
  return +$asFloat(value);
};
var $uD = function(value) {
  return +$asDouble(value);
};






// TypeArray conversions

var $byteArray2TypedArray = function(value) { return new $g["Int8Array"](value.u); };
var $shortArray2TypedArray = function(value) { return new $g["Int16Array"](value.u); };
var $charArray2TypedArray = function(value) { return new $g["Uint16Array"](value.u); };
var $intArray2TypedArray = function(value) { return new $g["Int32Array"](value.u); };
var $floatArray2TypedArray = function(value) { return new $g["Float32Array"](value.u); };
var $doubleArray2TypedArray = function(value) { return new $g["Float64Array"](value.u); };

var $typedArray2ByteArray = function(value) {
  var arrayClassData = $d_B.getArrayOf();
  return new arrayClassData.constr(new $g["Int8Array"](value));
};
var $typedArray2ShortArray = function(value) {
  var arrayClassData = $d_S.getArrayOf();
  return new arrayClassData.constr(new $g["Int16Array"](value));
};
var $typedArray2CharArray = function(value) {
  var arrayClassData = $d_C.getArrayOf();
  return new arrayClassData.constr(new $g["Uint16Array"](value));
};
var $typedArray2IntArray = function(value) {
  var arrayClassData = $d_I.getArrayOf();
  return new arrayClassData.constr(new $g["Int32Array"](value));
};
var $typedArray2FloatArray = function(value) {
  var arrayClassData = $d_F.getArrayOf();
  return new arrayClassData.constr(new $g["Float32Array"](value));
};
var $typedArray2DoubleArray = function(value) {
  var arrayClassData = $d_D.getArrayOf();
  return new arrayClassData.constr(new $g["Float64Array"](value));
};

/* We have to force a non-elidable *read* of $e, otherwise Closure will
 * eliminate it altogether, along with all the exports, which is ... er ...
 * plain wrong.
 */
this["__ScalaJSExportsNamespace"] = $e;

// TypeData class


/** @constructor */
var $TypeData = function() {




  // Runtime support
  this.constr = void 0;
  this.parentData = void 0;
  this.ancestors = null;
  this.componentData = null;
  this.arrayBase = null;
  this.arrayDepth = 0;
  this.zero = null;
  this.arrayEncodedName = "";
  this._classOf = void 0;
  this._arrayOf = void 0;
  this.isArrayOf = void 0;

  // java.lang.Class support
  this["name"] = "";
  this["isPrimitive"] = false;
  this["isInterface"] = false;
  this["isArrayClass"] = false;
  this["isRawJSType"] = false;
  this["isInstance"] = void 0;
};


$TypeData.prototype.initPrim = function(



    zero, arrayEncodedName, displayName) {
  // Runtime support
  this.ancestors = {};
  this.componentData = null;
  this.zero = zero;
  this.arrayEncodedName = arrayEncodedName;
  this.isArrayOf = function(obj, depth) { return false; };

  // java.lang.Class support
  this["name"] = displayName;
  this["isPrimitive"] = true;
  this["isInstance"] = function(obj) { return false; };

  return this;
};


$TypeData.prototype.initClass = function(



    internalNameObj, isInterface, fullName,
    ancestors, isRawJSType, parentData, isInstance, isArrayOf) {
  var internalName = $propertyName(internalNameObj);

  isInstance = isInstance || function(obj) {
    return !!(obj && obj.$classData && obj.$classData.ancestors[internalName]);
  };

  isArrayOf = isArrayOf || function(obj, depth) {
    return !!(obj && obj.$classData && (obj.$classData.arrayDepth === depth)
      && obj.$classData.arrayBase.ancestors[internalName])
  };

  // Runtime support
  this.parentData = parentData;
  this.ancestors = ancestors;
  this.arrayEncodedName = "L"+fullName+";";
  this.isArrayOf = isArrayOf;

  // java.lang.Class support
  this["name"] = fullName;
  this["isInterface"] = isInterface;
  this["isRawJSType"] = !!isRawJSType;
  this["isInstance"] = isInstance;

  return this;
};


$TypeData.prototype.initArray = function(



    componentData) {
  // The constructor

  var componentZero0 = componentData.zero;

  // The zero for the Long runtime representation
  // is a special case here, since the class has not
  // been defined yet, when this file is read
  var componentZero = (componentZero0 == "longZero")
    ? $m_sjsr_RuntimeLong$().Zero$1
    : componentZero0;


  /** @constructor */
  var ArrayClass = function(arg) {
    if (typeof(arg) === "number") {
      // arg is the length of the array
      this.u = new Array(arg);
      for (var i = 0; i < arg; i++)
        this.u[i] = componentZero;
    } else {
      // arg is a native array that we wrap
      this.u = arg;
    }
  }
  ArrayClass.prototype = new $h_O;
  ArrayClass.prototype.constructor = ArrayClass;

  ArrayClass.prototype.clone__O = function() {
    if (this.u instanceof Array)
      return new ArrayClass(this.u["slice"](0));
    else
      // The underlying Array is a TypedArray
      return new ArrayClass(new this.u.constructor(this.u));
  };

























  ArrayClass.prototype.$classData = this;

  // Don't generate reflective call proxies. The compiler special cases
  // reflective calls to methods on scala.Array

  // The data

  var encodedName = "[" + componentData.arrayEncodedName;
  var componentBase = componentData.arrayBase || componentData;
  var arrayDepth = componentData.arrayDepth + 1;

  var isInstance = function(obj) {
    return componentBase.isArrayOf(obj, arrayDepth);
  }

  // Runtime support
  this.constr = ArrayClass;
  this.parentData = $d_O;
  this.ancestors = {O: 1, jl_Cloneable: 1, Ljava_io_Serializable: 1};
  this.componentData = componentData;
  this.arrayBase = componentBase;
  this.arrayDepth = arrayDepth;
  this.zero = null;
  this.arrayEncodedName = encodedName;
  this._classOf = undefined;
  this._arrayOf = undefined;
  this.isArrayOf = undefined;

  // java.lang.Class support
  this["name"] = encodedName;
  this["isPrimitive"] = false;
  this["isInterface"] = false;
  this["isArrayClass"] = true;
  this["isInstance"] = isInstance;

  return this;
};


$TypeData.prototype.getClassOf = function() {



  if (!this._classOf)
    this._classOf = new $c_jl_Class().init___jl_ScalaJSClassData(this);
  return this._classOf;
};


$TypeData.prototype.getArrayOf = function() {



  if (!this._arrayOf)
    this._arrayOf = new $TypeData().initArray(this);
  return this._arrayOf;
};

// java.lang.Class support


$TypeData.prototype["getFakeInstance"] = function() {



  if (this === $d_T)
    return "some string";
  else if (this === $d_jl_Boolean)
    return false;
  else if (this === $d_jl_Byte ||
           this === $d_jl_Short ||
           this === $d_jl_Integer ||
           this === $d_jl_Float ||
           this === $d_jl_Double)
    return 0;
  else if (this === $d_jl_Long)
    return $m_sjsr_RuntimeLong$().Zero$1;
  else if (this === $d_sr_BoxedUnit)
    return void 0;
  else
    return {$classData: this};
};


$TypeData.prototype["getSuperclass"] = function() {



  return this.parentData ? this.parentData.getClassOf() : null;
};


$TypeData.prototype["getComponentType"] = function() {



  return this.componentData ? this.componentData.getClassOf() : null;
};


$TypeData.prototype["newArrayOfThisClass"] = function(lengths) {



  var arrayClassData = this;
  for (var i = 0; i < lengths.length; i++)
    arrayClassData = arrayClassData.getArrayOf();
  return $newArrayObject(arrayClassData, lengths);
};




// Create primitive types

var $d_V = new $TypeData().initPrim(undefined, "V", "void");
var $d_Z = new $TypeData().initPrim(false, "Z", "boolean");
var $d_C = new $TypeData().initPrim(0, "C", "char");
var $d_B = new $TypeData().initPrim(0, "B", "byte");
var $d_S = new $TypeData().initPrim(0, "S", "short");
var $d_I = new $TypeData().initPrim(0, "I", "int");
var $d_J = new $TypeData().initPrim("longZero", "J", "long");
var $d_F = new $TypeData().initPrim(0.0, "F", "float");
var $d_D = new $TypeData().initPrim(0.0, "D", "double");

// Instance tests for array of primitives

var $isArrayOf_Z = $makeIsArrayOfPrimitive($d_Z);
$d_Z.isArrayOf = $isArrayOf_Z;

var $isArrayOf_C = $makeIsArrayOfPrimitive($d_C);
$d_C.isArrayOf = $isArrayOf_C;

var $isArrayOf_B = $makeIsArrayOfPrimitive($d_B);
$d_B.isArrayOf = $isArrayOf_B;

var $isArrayOf_S = $makeIsArrayOfPrimitive($d_S);
$d_S.isArrayOf = $isArrayOf_S;

var $isArrayOf_I = $makeIsArrayOfPrimitive($d_I);
$d_I.isArrayOf = $isArrayOf_I;

var $isArrayOf_J = $makeIsArrayOfPrimitive($d_J);
$d_J.isArrayOf = $isArrayOf_J;

var $isArrayOf_F = $makeIsArrayOfPrimitive($d_F);
$d_F.isArrayOf = $isArrayOf_F;

var $isArrayOf_D = $makeIsArrayOfPrimitive($d_D);
$d_D.isArrayOf = $isArrayOf_D;


// asInstanceOfs for array of primitives
var $asArrayOf_Z = $makeAsArrayOfPrimitive($isArrayOf_Z, "Z");
var $asArrayOf_C = $makeAsArrayOfPrimitive($isArrayOf_C, "C");
var $asArrayOf_B = $makeAsArrayOfPrimitive($isArrayOf_B, "B");
var $asArrayOf_S = $makeAsArrayOfPrimitive($isArrayOf_S, "S");
var $asArrayOf_I = $makeAsArrayOfPrimitive($isArrayOf_I, "I");
var $asArrayOf_J = $makeAsArrayOfPrimitive($isArrayOf_J, "J");
var $asArrayOf_F = $makeAsArrayOfPrimitive($isArrayOf_F, "F");
var $asArrayOf_D = $makeAsArrayOfPrimitive($isArrayOf_D, "D");

function $is_F1(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.F1)))
}
function $as_F1(obj) {
  return (($is_F1(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Function1"))
}
function $isArrayOf_F1(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.F1)))
}
function $asArrayOf_F1(obj, depth) {
  return (($isArrayOf_F1(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Function1;", depth))
}
var $d_Lcom_darkoverlordofdata_entitas_GroupEventType$EnumVal = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_GroupEventType$EnumVal: 0
}, true, "com.darkoverlordofdata.entitas.GroupEventType$EnumVal", {
  Lcom_darkoverlordofdata_entitas_GroupEventType$EnumVal: 1
});
function $is_Lcom_darkoverlordofdata_entitas_IClearReactiveSystem(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_IClearReactiveSystem)))
}
function $as_Lcom_darkoverlordofdata_entitas_IClearReactiveSystem(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_IClearReactiveSystem(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.IClearReactiveSystem"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_IClearReactiveSystem(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_IClearReactiveSystem)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_IClearReactiveSystem(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_IClearReactiveSystem(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.IClearReactiveSystem;", depth))
}
var $d_Lcom_darkoverlordofdata_entitas_IComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_IComponent: 0
}, true, "com.darkoverlordofdata.entitas.IComponent", {
  Lcom_darkoverlordofdata_entitas_IComponent: 1
});
function $is_Lcom_darkoverlordofdata_entitas_IEnsureComponents(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_IEnsureComponents)))
}
function $as_Lcom_darkoverlordofdata_entitas_IEnsureComponents(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_IEnsureComponents(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.IEnsureComponents"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_IEnsureComponents(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_IEnsureComponents)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_IEnsureComponents(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_IEnsureComponents(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.IEnsureComponents;", depth))
}
function $is_Lcom_darkoverlordofdata_entitas_IExcludeComponents(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_IExcludeComponents)))
}
function $as_Lcom_darkoverlordofdata_entitas_IExcludeComponents(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_IExcludeComponents(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.IExcludeComponents"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_IExcludeComponents(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_IExcludeComponents)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_IExcludeComponents(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_IExcludeComponents(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.IExcludeComponents;", depth))
}
function $is_Lcom_darkoverlordofdata_entitas_IMatcher(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_IMatcher)))
}
function $as_Lcom_darkoverlordofdata_entitas_IMatcher(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_IMatcher(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.IMatcher"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_IMatcher(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_IMatcher)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_IMatcher(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_IMatcher(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.IMatcher;", depth))
}
var $d_Lcom_darkoverlordofdata_entitas_IMatcher = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_IMatcher: 0
}, true, "com.darkoverlordofdata.entitas.IMatcher", {
  Lcom_darkoverlordofdata_entitas_IMatcher: 1
});
function $is_Lcom_darkoverlordofdata_entitas_ISetPool(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_ISetPool)))
}
function $as_Lcom_darkoverlordofdata_entitas_ISetPool(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_ISetPool(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.ISetPool"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_ISetPool(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_ISetPool)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_ISetPool(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_ISetPool(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.ISetPool;", depth))
}
/** @constructor */
function $c_O() {
  /*<skip>*/
}
/** @constructor */
function $h_O() {
  /*<skip>*/
}
$h_O.prototype = $c_O.prototype;
$c_O.prototype.init___ = (function() {
  return this
});
$c_O.prototype.equals__O__Z = (function(that) {
  return (this === that)
});
$c_O.prototype.toString__T = (function() {
  var jsx$2 = $objectGetClass(this).getName__T();
  var i = this.hashCode__I();
  var x = $uD((i >>> 0));
  var jsx$1 = x.toString(16);
  return ((jsx$2 + "@") + $as_T(jsx$1))
});
$c_O.prototype.hashCode__I = (function() {
  return $systemIdentityHashCode(this)
});
$c_O.prototype.toString = (function() {
  return this.toString__T()
});
function $is_O(obj) {
  return (obj !== null)
}
function $as_O(obj) {
  return obj
}
function $isArrayOf_O(obj, depth) {
  var data = (obj && obj.$classData);
  if ((!data)) {
    return false
  } else {
    var arrayDepth = (data.arrayDepth || 0);
    return ((!(arrayDepth < depth)) && ((arrayDepth > depth) || (!data.arrayBase.isPrimitive)))
  }
}
function $asArrayOf_O(obj, depth) {
  return (($isArrayOf_O(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Object;", depth))
}
var $d_O = new $TypeData().initClass({
  O: 0
}, false, "java.lang.Object", {
  O: 1
}, (void 0), (void 0), $is_O, $isArrayOf_O);
$c_O.prototype.$classData = $d_O;
function $s_s_Product2$class__productElement__s_Product2__I__O($$this, n) {
  switch (n) {
    case 0: {
      return $$this.$$und1$f;
      break
    }
    case 1: {
      return $$this.$$und2$f;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
    }
  }
}
function $s_s_Product3$class__productElement__s_Product3__I__O($$this, n) {
  switch (n) {
    case 0: {
      return $$this.$$und1$1;
      break
    }
    case 1: {
      return $$this.$$und2$1;
      break
    }
    case 2: {
      return $$this.$$und3$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
    }
  }
}
function $s_s_Proxy$class__toString__s_Proxy__T($$this) {
  return ("" + $$this.self$1)
}
function $s_s_Proxy$class__equals__s_Proxy__O__Z($$this, that) {
  return ((that !== null) && (((that === $$this) || (that === $$this.self$1)) || $objectEquals(that, $$this.self$1)))
}
function $s_s_math_Ordering$IntOrdering$class__compare__s_math_Ordering$IntOrdering__I__I__I($$this, x, y) {
  return ((x < y) ? (-1) : ((x === y) ? 0 : 1))
}
function $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z($$this, x, y) {
  return ($$this.compare__O__O__I(x, y) <= 0)
}
function $s_s_reflect_ClassTag$class__newArray__s_reflect_ClassTag__I__O($$this, len) {
  var x1 = $$this.runtimeClass__jl_Class();
  return ((x1 === $d_B.getClassOf()) ? $newArrayObject($d_B.getArrayOf(), [len]) : ((x1 === $d_S.getClassOf()) ? $newArrayObject($d_S.getArrayOf(), [len]) : ((x1 === $d_C.getClassOf()) ? $newArrayObject($d_C.getArrayOf(), [len]) : ((x1 === $d_I.getClassOf()) ? $newArrayObject($d_I.getArrayOf(), [len]) : ((x1 === $d_J.getClassOf()) ? $newArrayObject($d_J.getArrayOf(), [len]) : ((x1 === $d_F.getClassOf()) ? $newArrayObject($d_F.getArrayOf(), [len]) : ((x1 === $d_D.getClassOf()) ? $newArrayObject($d_D.getArrayOf(), [len]) : ((x1 === $d_Z.getClassOf()) ? $newArrayObject($d_Z.getArrayOf(), [len]) : ((x1 === $d_V.getClassOf()) ? $newArrayObject($d_sr_BoxedUnit.getArrayOf(), [len]) : $m_jl_reflect_Array$().newInstance__jl_Class__I__O($$this.runtimeClass__jl_Class(), len))))))))))
}
function $s_s_reflect_ClassTag$class__equals__s_reflect_ClassTag__O__Z($$this, x) {
  if ($is_s_reflect_ClassTag(x)) {
    var x$2 = $$this.runtimeClass__jl_Class();
    var x$3 = $as_s_reflect_ClassTag(x).runtimeClass__jl_Class();
    return (x$2 === x$3)
  } else {
    return false
  }
}
function $s_s_reflect_ClassTag$class__prettyprint$1__p0__s_reflect_ClassTag__jl_Class__T($$this, clazz) {
  if (clazz.isArray__Z()) {
    var jsx$2 = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Array[", "]"]));
    if ((clazz !== null)) {
      var jsx$1 = clazz.getComponentType__jl_Class()
    } else {
      if ((!$is_s_reflect_ClassTag(clazz))) {
        throw new $c_jl_UnsupportedOperationException().init___T(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["unsupported schematic ", " (", ")"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([clazz, $objectGetClass(clazz)])))
      };
      var x3 = $as_s_reflect_ClassTag(clazz);
      var jsx$1 = x3.runtimeClass__jl_Class()
    };
    return jsx$2.s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([$s_s_reflect_ClassTag$class__prettyprint$1__p0__s_reflect_ClassTag__jl_Class__T($$this, jsx$1)]))
  } else {
    return clazz.getName__T()
  }
}
function $s_s_util_control_NoStackTrace$class__fillInStackTrace__s_util_control_NoStackTrace__jl_Throwable($$this) {
  var this$1 = $m_s_util_control_NoStackTrace$();
  if (this$1.$$undnoSuppression$1) {
    return $c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable.call($$this)
  } else {
    return $as_jl_Throwable($$this)
  }
}
function $s_sc_GenMapLike$class__liftedTree1$1__p0__sc_GenMapLike__sc_GenMap__Z($$this, x2$1) {
  try {
    var this$1 = $$this.iterator__sc_Iterator();
    var res = true;
    while ((res && this$1.hasNext__Z())) {
      var arg1 = this$1.next__O();
      var x0$1 = $as_T2(arg1);
      if ((x0$1 === null)) {
        throw new $c_s_MatchError().init___O(x0$1)
      };
      var k = x0$1.$$und1$f;
      var v = x0$1.$$und2$f;
      var x1$2 = x2$1.get__O__s_Option(k);
      matchEnd6: {
        if ($is_s_Some(x1$2)) {
          var x2 = $as_s_Some(x1$2);
          var p3 = x2.x$2;
          if ($m_sr_BoxesRunTime$().equals__O__O__Z(v, p3)) {
            res = true;
            break matchEnd6
          }
        };
        res = false
      }
    };
    return res
  } catch (e) {
    if ($is_jl_ClassCastException(e)) {
      $as_jl_ClassCastException(e);
      return false
    } else {
      throw e
    }
  }
}
function $s_sc_GenMapLike$class__equals__sc_GenMapLike__O__Z($$this, that) {
  if ($is_sc_GenMap(that)) {
    var x2 = $as_sc_GenMap(that);
    return (($$this === x2) || (($$this.tableSize$5 === x2.tableSize$5) && $s_sc_GenMapLike$class__liftedTree1$1__p0__sc_GenMapLike__sc_GenMap__Z($$this, x2)))
  } else {
    return false
  }
}
function $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z($$this, that) {
  if ($is_sc_GenSeq(that)) {
    var x2 = $as_sc_GenSeq(that);
    return $$this.sameElements__sc_GenIterable__Z(x2)
  } else {
    return false
  }
}
function $s_sc_GenSetLike$class__liftedTree1$1__p0__sc_GenSetLike__sc_GenSet__Z($$this, x2$1) {
  try {
    return $$this.subsetOf__sc_GenSet__Z(x2$1)
  } catch (e) {
    if ($is_jl_ClassCastException(e)) {
      $as_jl_ClassCastException(e);
      return false
    } else {
      throw e
    }
  }
}
function $s_sc_GenSetLike$class__equals__sc_GenSetLike__O__Z($$this, that) {
  if ($is_sc_GenSet(that)) {
    var x2 = $as_sc_GenSet(that);
    return (($$this === x2) || (($$this.size__I() === x2.size__I()) && $s_sc_GenSetLike$class__liftedTree1$1__p0__sc_GenSetLike__sc_GenSet__Z($$this, x2)))
  } else {
    return false
  }
}
function $is_sc_GenTraversableOnce(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenTraversableOnce)))
}
function $as_sc_GenTraversableOnce(obj) {
  return (($is_sc_GenTraversableOnce(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenTraversableOnce"))
}
function $isArrayOf_sc_GenTraversableOnce(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenTraversableOnce)))
}
function $asArrayOf_sc_GenTraversableOnce(obj, depth) {
  return (($isArrayOf_sc_GenTraversableOnce(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenTraversableOnce;", depth))
}
function $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I($$this, len) {
  return (($$this.length__I() - len) | 0)
}
function $s_sc_IndexedSeqOptimized$class__last__sc_IndexedSeqOptimized__O($$this) {
  return (($$this.length__I() > 0) ? $$this.apply__I__O((((-1) + $$this.length__I()) | 0)) : $s_sc_TraversableLike$class__last__sc_TraversableLike__O($$this))
}
function $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O($$this, from, until) {
  var lo = ((from > 0) ? from : 0);
  var x = ((until > 0) ? until : 0);
  var y = $$this.length__I();
  var hi = ((x < y) ? x : y);
  var x$1 = ((hi - lo) | 0);
  var elems = ((x$1 > 0) ? x$1 : 0);
  var b = $$this.newBuilder__scm_Builder();
  b.sizeHint__I__V(elems);
  var i = lo;
  while ((i < hi)) {
    b.$$plus$eq__O__scm_Builder($$this.apply__I__O(i));
    i = ((1 + i) | 0)
  };
  return b.result__O()
}
function $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V($$this, xs, start, len) {
  var i = 0;
  var j = start;
  var x = $$this.length__I();
  var x$1 = ((x < len) ? x : len);
  var that = (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0);
  var end = ((x$1 < that) ? x$1 : that);
  while ((i < end)) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(xs, j, $$this.apply__I__O(i));
    i = ((1 + i) | 0);
    j = ((1 + j) | 0)
  }
}
function $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z($$this, that) {
  if ($is_sc_IndexedSeq(that)) {
    var x2 = $as_sc_IndexedSeq(that);
    var len = $$this.length__I();
    if ((len === x2.length__I())) {
      var i = 0;
      while (((i < len) && $m_sr_BoxesRunTime$().equals__O__O__Z($$this.apply__I__O(i), x2.apply__I__O(i)))) {
        i = ((1 + i) | 0)
      };
      return (i === len)
    } else {
      return false
    }
  } else {
    return $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z($$this, that)
  }
}
function $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V($$this, f) {
  var i = 0;
  var len = $$this.length__I();
  while ((i < len)) {
    f.apply__O__O($$this.apply__I__O(i));
    i = ((1 + i) | 0)
  }
}
function $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O($$this) {
  return ($s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z($$this) ? $s_sc_TraversableLike$class__tail__sc_TraversableLike__O($$this) : $$this.slice__I__I__O(1, $$this.length__I()))
}
function $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z($$this) {
  return ($$this.length__I() === 0)
}
function $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O($$this) {
  return ($s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z($$this) ? new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I($$this, 0, $$this.length__I()).next__O() : $$this.apply__I__O(0))
}
function $s_sc_IterableLike$class__drop__sc_IterableLike__I__O($$this, n) {
  var b = $$this.newBuilder__scm_Builder();
  var lo = ((n < 0) ? 0 : n);
  var delta = ((-lo) | 0);
  $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__I__V(b, $$this, delta);
  var i = 0;
  var it = $$this.iterator__sc_Iterator();
  while (((i < n) && it.hasNext__Z())) {
    it.next__O();
    i = ((1 + i) | 0)
  };
  return $as_scm_Builder(b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(it)).result__O()
}
function $s_sc_IterableLike$class__copyToArray__sc_IterableLike__O__I__I__V($$this, xs, start, len) {
  var i = start;
  var x = ((start + len) | 0);
  var that = $m_sr_ScalaRunTime$().array$undlength__O__I(xs);
  var end = ((x < that) ? x : that);
  var it = $$this.iterator__sc_Iterator();
  while (((i < end) && it.hasNext__Z())) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(xs, i, it.next__O());
    i = ((1 + i) | 0)
  }
}
function $s_sc_IterableLike$class__take__sc_IterableLike__I__O($$this, n) {
  var b = $$this.newBuilder__scm_Builder();
  if ((n <= 0)) {
    return b.result__O()
  } else {
    b.sizeHintBounded__I__sc_TraversableLike__V(n, $$this);
    var i = 0;
    var it = $$this.iterator__sc_Iterator();
    while (((i < n) && it.hasNext__Z())) {
      b.$$plus$eq__O__scm_Builder(it.next__O());
      i = ((1 + i) | 0)
    };
    return b.result__O()
  }
}
function $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z($$this, that) {
  var these = $$this.iterator__sc_Iterator();
  var those = that.iterator__sc_Iterator();
  while ((these.hasNext__Z() && those.hasNext__Z())) {
    if ((!$m_sr_BoxesRunTime$().equals__O__O__Z(these.next__O(), those.next__O()))) {
      return false
    }
  };
  return ((!these.hasNext__Z()) && (!those.hasNext__Z()))
}
function $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream($$this) {
  if ($$this.hasNext__Z()) {
    var hd = $$this.next__O();
    var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($$this$1) {
      return (function() {
        return $$this$1.toStream__sci_Stream()
      })
    })($$this));
    return new $c_sci_Stream$Cons().init___O__F0(hd, tl)
  } else {
    $m_sci_Stream$();
    return $m_sci_Stream$Empty$()
  }
}
function $s_sc_Iterator$class__isEmpty__sc_Iterator__Z($$this) {
  return (!$$this.hasNext__Z())
}
function $s_sc_Iterator$class__toString__sc_Iterator__T($$this) {
  return (($$this.hasNext__Z() ? "non-empty" : "empty") + " iterator")
}
function $s_sc_Iterator$class__copyToArray__sc_Iterator__O__I__I__V($$this, xs, start, len) {
  var requirement = ((start >= 0) && ((start < $m_sr_ScalaRunTime$().array$undlength__O__I(xs)) || ($m_sr_ScalaRunTime$().array$undlength__O__I(xs) === 0)));
  if ((!requirement)) {
    throw new $c_jl_IllegalArgumentException().init___T(("requirement failed: " + new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["start ", " out of range ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([start, $m_sr_ScalaRunTime$().array$undlength__O__I(xs)]))))
  };
  var i = start;
  var y = (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0);
  var end = ((start + ((len < y) ? len : y)) | 0);
  while (((i < end) && $$this.hasNext__Z())) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(xs, i, $$this.next__O());
    i = ((1 + i) | 0)
  }
}
function $s_sc_Iterator$class__foreach__sc_Iterator__F1__V($$this, f) {
  while ($$this.hasNext__Z()) {
    f.apply__O__O($$this.next__O())
  }
}
function $s_sc_Iterator$class__forall__sc_Iterator__F1__Z($$this, p) {
  var res = true;
  while ((res && $$this.hasNext__Z())) {
    res = $uZ(p.apply__O__O($$this.next__O()))
  };
  return res
}
function $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I($$this, len) {
  return ((len < 0) ? 1 : $s_sc_LinearSeqOptimized$class__loop$1__p0__sc_LinearSeqOptimized__I__sc_LinearSeqOptimized__I__I($$this, 0, $$this, len))
}
function $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O($$this, n) {
  var rest = $$this.drop__I__sc_LinearSeqOptimized(n);
  if (((n < 0) || rest.isEmpty__Z())) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
  };
  return rest.head__O()
}
function $s_sc_LinearSeqOptimized$class__loop$1__p0__sc_LinearSeqOptimized__I__sc_LinearSeqOptimized__I__I($$this, i, xs, len$1) {
  _loop: while (true) {
    if ((i === len$1)) {
      return (xs.isEmpty__Z() ? 0 : 1)
    } else if (xs.isEmpty__Z()) {
      return (-1)
    } else {
      var temp$i = ((1 + i) | 0);
      var temp$xs = $as_sc_LinearSeqOptimized(xs.tail__O());
      i = temp$i;
      xs = temp$xs;
      continue _loop
    }
  }
}
function $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I($$this) {
  var these = $$this;
  var len = 0;
  while ((!these.isEmpty__Z())) {
    len = ((1 + len) | 0);
    these = $as_sc_LinearSeqOptimized(these.tail__O())
  };
  return len
}
function $s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O($$this) {
  if ($$this.isEmpty__Z()) {
    throw new $c_ju_NoSuchElementException().init___()
  };
  var these = $$this;
  var nx = $as_sc_LinearSeqOptimized(these.tail__O());
  while ((!nx.isEmpty__Z())) {
    these = nx;
    nx = $as_sc_LinearSeqOptimized(nx.tail__O())
  };
  return these.head__O()
}
function $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z($$this, that) {
  if ($is_sc_LinearSeq(that)) {
    var x2 = $as_sc_LinearSeq(that);
    if (($$this === x2)) {
      return true
    } else {
      var these = $$this;
      var those = x2;
      while ((((!these.isEmpty__Z()) && (!those.isEmpty__Z())) && $m_sr_BoxesRunTime$().equals__O__O__Z(these.head__O(), those.head__O()))) {
        these = $as_sc_LinearSeqOptimized(these.tail__O());
        those = $as_sc_LinearSeq(those.tail__O())
      };
      return (these.isEmpty__Z() && those.isEmpty__Z())
    }
  } else {
    return $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z($$this, that)
  }
}
function $s_sc_MapLike$class__addString__sc_MapLike__scm_StringBuilder__T__T__T__scm_StringBuilder($$this, b, start, sep, end) {
  var this$2 = $$this.iterator__sc_Iterator();
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1) {
    return (function(x0$1$2) {
      var x0$1 = $as_T2(x0$1$2);
      if ((x0$1 !== null)) {
        var k = x0$1.$$und1$f;
        var v = x0$1.$$und2$f;
        return (("" + $m_s_Predef$any2stringadd$().$$plus$extension__O__T__T(k, " -> ")) + v)
      } else {
        throw new $c_s_MatchError().init___O(x0$1)
      }
    })
  })($$this));
  var this$3 = new $c_sc_Iterator$$anon$11().init___sc_Iterator__F1(this$2, f);
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this$3, b, start, sep, end)
}
function $s_sc_MapLike$class__isEmpty__sc_MapLike__Z($$this) {
  return ($$this.tableSize$5 === 0)
}
function $s_sc_MapLike$class__$default__sc_MapLike__O__O($$this, key) {
  throw new $c_ju_NoSuchElementException().init___T(("key not found: " + key))
}
function $s_sc_SeqLike$class__indices__sc_SeqLike__sci_Range($$this) {
  var end = $$this.length__I();
  return new $c_sci_Range().init___I__I__I(0, end, 1)
}
function $s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z($$this) {
  return ($$this.lengthCompare__I__I(0) === 0)
}
function $s_sc_SeqLike$class__reverse__sc_SeqLike__O($$this) {
  var elem = $m_sci_Nil$();
  var xs = new $c_sr_ObjectRef().init___O(elem);
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, xs$1) {
    return (function(x$2) {
      var this$2 = $as_sci_List(xs$1.elem$1);
      xs$1.elem$1 = new $c_sci_$colon$colon().init___O__sci_List(x$2, this$2)
    })
  })($$this, xs)));
  var b = $$this.newBuilder__scm_Builder();
  $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V(b, $$this);
  var this$3 = $as_sci_List(xs.elem$1);
  var these = this$3;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    b.$$plus$eq__O__scm_Builder(arg1);
    these = $as_sci_List(these.tail__O())
  };
  return b.result__O()
}
function $s_sc_SeqLike$class__sortBy__sc_SeqLike__F1__s_math_Ordering__O($$this, f, ord) {
  var ord$1 = new $c_s_math_Ordering$$anon$5().init___s_math_Ordering__F1(ord, f);
  return $s_sc_SeqLike$class__sorted__sc_SeqLike__s_math_Ordering__O($$this, ord$1)
}
function $s_sc_SeqLike$class__sorted__sc_SeqLike__s_math_Ordering__O($$this, ord) {
  var len = $$this.length__I();
  var b = $$this.newBuilder__scm_Builder();
  if ((len === 1)) {
    b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($$this)
  } else if ((len > 1)) {
    b.sizeHint__I__V(len);
    var arr = $newArrayObject($d_O.getArrayOf(), [len]);
    var i = new $c_sr_IntRef().init___I(0);
    $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, arr$1, i$1) {
      return (function(x$2) {
        arr$1.u[i$1.elem$1] = x$2;
        i$1.elem$1 = ((1 + i$1.elem$1) | 0)
      })
    })($$this, arr, i)));
    $m_ju_Arrays$().sort__AO__ju_Comparator__V(arr, ord);
    i.elem$1 = 0;
    while ((i.elem$1 < arr.u.length)) {
      b.$$plus$eq__O__scm_Builder(arr.u[i.elem$1]);
      i.elem$1 = ((1 + i.elem$1) | 0)
    }
  };
  return b.result__O()
}
function $s_sc_SeqLike$class__lengthCompare__sc_SeqLike__I__I($$this, len) {
  if ((len < 0)) {
    return 1
  } else {
    var i = 0;
    var it = $$this.iterator__sc_Iterator();
    while (it.hasNext__Z()) {
      if ((i === len)) {
        return (it.hasNext__Z() ? 1 : 0)
      };
      it.next__O();
      i = ((1 + i) | 0)
    };
    return ((i - len) | 0)
  }
}
function $s_sc_SetLike$class__isEmpty__sc_SetLike__Z($$this) {
  return ($$this.size__I() === 0)
}
function $s_sc_TraversableLike$class__to__sc_TraversableLike__scg_CanBuildFrom__O($$this, cbf) {
  var b = cbf.apply__scm_Builder();
  $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V(b, $$this);
  b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($$this.thisCollection__sc_Traversable());
  return b.result__O()
}
function $s_sc_TraversableLike$class__toString__sc_TraversableLike__T($$this) {
  return $$this.mkString__T__T__T__T(($$this.stringPrefix__T() + "("), ", ", ")")
}
function $s_sc_TraversableLike$class__flatMap__sc_TraversableLike__F1__scg_CanBuildFrom__O($$this, f, bf) {
  var b = bf.apply__O__scm_Builder($$this.repr__O());
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, b$1, f$1) {
    return (function(x$2) {
      return $as_scm_Builder(b$1.$$plus$plus$eq__sc_TraversableOnce__scg_Growable($as_sc_GenTraversableOnce(f$1.apply__O__O(x$2)).seq__sc_TraversableOnce()))
    })
  })($$this, b, f)));
  return b.result__O()
}
function $s_sc_TraversableLike$class__tail__sc_TraversableLike__O($$this) {
  if ($$this.isEmpty__Z()) {
    throw new $c_jl_UnsupportedOperationException().init___T("empty.tail")
  };
  return $$this.drop__I__O(1)
}
function $s_sc_TraversableLike$class__builder$1__p0__sc_TraversableLike__scg_CanBuildFrom__scm_Builder($$this, bf$1) {
  var b = bf$1.apply__O__scm_Builder($$this.repr__O());
  $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V(b, $$this);
  return b
}
function $s_sc_TraversableLike$class__stringPrefix__sc_TraversableLike__T($$this) {
  var this$1 = $$this.repr__O();
  var string = $objectGetClass(this$1).getName__T();
  var idx1 = $m_sjsr_RuntimeString$().lastIndexOf__T__I__I(string, 46);
  if ((idx1 !== (-1))) {
    var thiz = string;
    var beginIndex = ((1 + idx1) | 0);
    string = $as_T(thiz.substring(beginIndex))
  };
  var idx2 = $m_sjsr_RuntimeString$().indexOf__T__I__I(string, 36);
  if ((idx2 !== (-1))) {
    var thiz$1 = string;
    string = $as_T(thiz$1.substring(0, idx2))
  };
  return string
}
function $s_sc_TraversableLike$class__last__sc_TraversableLike__O($$this) {
  var elem = $$this.head__O();
  var lst = new $c_sr_ObjectRef().init___O(elem);
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, lst$1) {
    return (function(x$2) {
      lst$1.elem$1 = x$2
    })
  })($$this, lst)));
  return lst.elem$1
}
function $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder($$this, b, start, sep, end) {
  var first = new $c_sr_BooleanRef().init___Z(true);
  b.append__T__scm_StringBuilder(start);
  $$this.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1, first$1, b$1, sep$1) {
    return (function(x$2) {
      if (first$1.elem$1) {
        b$1.append__O__scm_StringBuilder(x$2);
        first$1.elem$1 = false;
        return (void 0)
      } else {
        b$1.append__T__scm_StringBuilder(sep$1);
        return b$1.append__O__scm_StringBuilder(x$2)
      }
    })
  })($$this, first, b, sep)));
  b.append__T__scm_StringBuilder(end);
  return b
}
function $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T($$this, start, sep, end) {
  var this$1 = $$this.addString__scm_StringBuilder__T__T__T__scm_StringBuilder(new $c_scm_StringBuilder().init___(), start, sep, end);
  var this$2 = this$1.underlying$5;
  return this$2.content$1
}
function $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z($$this) {
  return (!$$this.isEmpty__Z())
}
function $s_sc_TraversableOnce$class__copyToArray__sc_TraversableOnce__O__I__V($$this, xs, start) {
  $$this.copyToArray__O__I__I__V(xs, start, (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0))
}
function $s_scg_Growable$class__loop$1__p0__scg_Growable__sc_LinearSeq__V($$this, xs) {
  _loop: while (true) {
    var this$1 = xs;
    if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)) {
      $$this.$$plus$eq__O__scg_Growable(xs.head__O());
      xs = $as_sc_LinearSeq(xs.tail__O());
      continue _loop
    };
    break
  }
}
function $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable($$this, xs) {
  if ($is_sc_LinearSeq(xs)) {
    var x2 = $as_sc_LinearSeq(xs);
    $s_scg_Growable$class__loop$1__p0__scg_Growable__sc_LinearSeq__V($$this, x2)
  } else {
    xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($$this$1) {
      return (function(elem$2) {
        return $$this$1.$$plus$eq__O__scg_Growable(elem$2)
      })
    })($$this)))
  };
  return $$this
}
function $s_sci_StringLike$class__split__sci_StringLike__C__AT($$this, separator) {
  var thisString = $$this.toString__T();
  var pos = $m_sjsr_RuntimeString$().indexOf__T__I__I(thisString, separator);
  if ((pos !== (-1))) {
    var res = new $c_scm_ArrayBuilder$ofRef().init___s_reflect_ClassTag(new $c_s_reflect_ClassTag$ClassClassTag().init___jl_Class($d_T.getClassOf()));
    var prev = 0;
    do {
      var beginIndex = prev;
      var endIndex = pos;
      res.$$plus$eq__O__scm_ArrayBuilder$ofRef($as_T(thisString.substring(beginIndex, endIndex)));
      prev = ((1 + pos) | 0);
      pos = $m_sjsr_RuntimeString$().indexOf__T__I__I__I(thisString, separator, prev)
    } while ((pos !== (-1)));
    if ((prev !== $uI(thisString.length))) {
      var beginIndex$1 = prev;
      var endIndex$1 = $uI(thisString.length);
      res.$$plus$eq__O__scm_ArrayBuilder$ofRef($as_T(thisString.substring(beginIndex$1, endIndex$1)))
    };
    var initialResult = $asArrayOf_T(res.result__AO(), 1);
    pos = initialResult.u.length;
    while (true) {
      if ((pos > 0)) {
        var thiz = initialResult.u[(((-1) + pos) | 0)];
        if ((thiz === null)) {
          throw new $c_jl_NullPointerException().init___()
        };
        var jsx$1 = (thiz === "")
      } else {
        var jsx$1 = false
      };
      if (jsx$1) {
        pos = (((-1) + pos) | 0)
      } else {
        break
      }
    };
    if ((pos !== initialResult.u.length)) {
      var trimmed = $newArrayObject($d_T.getArrayOf(), [pos]);
      $m_s_Array$().copy__O__I__O__I__I__V(initialResult, 0, trimmed, 0, pos);
      return trimmed
    } else {
      return initialResult
    }
  } else {
    var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array([thisString]);
    var len = $uI(xs.array$6.length);
    var array = $newArrayObject($d_T.getArrayOf(), [len]);
    var elem$1 = 0;
    elem$1 = 0;
    var this$12 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(xs, 0, $uI(xs.array$6.length));
    while (this$12.hasNext__Z()) {
      var arg1 = this$12.next__O();
      array.u[elem$1] = arg1;
      elem$1 = ((1 + elem$1) | 0)
    };
    return array
  }
}
function $s_sci_StringLike$class__stripSuffix__sci_StringLike__T__T($$this, suffix) {
  if ($m_sjsr_RuntimeString$().endsWith__T__T__Z($$this.toString__T(), suffix)) {
    var thiz$1 = $$this.toString__T();
    var thiz = $$this.toString__T();
    var endIndex = (($uI(thiz.length) - $uI(suffix.length)) | 0);
    return $as_T(thiz$1.substring(0, endIndex))
  } else {
    return $$this.toString__T()
  }
}
function $s_sci_StringLike$class__slice__sci_StringLike__I__I__O($$this, from, until) {
  var start = ((from > 0) ? from : 0);
  var that = $$this.length__I();
  var end = ((until < that) ? until : that);
  if ((start >= end)) {
    return $$this.newBuilder__scm_Builder().result__O()
  } else {
    var jsx$1 = $$this.newBuilder__scm_Builder();
    var thiz = $$this.toString__T();
    var x = $as_T(thiz.substring(start, end));
    return $as_scm_Builder(jsx$1.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(new $c_sci_StringOps().init___T(x))).result__O()
  }
}
function $s_sci_VectorPointer$class__getElem__sci_VectorPointer__I__I__O($$this, index, xor) {
  if ((xor < 32)) {
    return $$this.display0__AO().u[(31 & index)]
  } else if ((xor < 1024)) {
    return $asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 32768)) {
    return $asArrayOf_O($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 1048576)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1).u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 33554432)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1).u[(31 & (index >> 15))], 1).u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else if ((xor < 1073741824)) {
    return $asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($asArrayOf_O($$this.display5__AO().u[(31 & (index >> 25))], 1).u[(31 & (index >> 20))], 1).u[(31 & (index >> 15))], 1).u[(31 & (index >> 10))], 1).u[(31 & (index >> 5))], 1).u[(31 & index)]
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_sci_VectorPointer$class__gotoNextBlockStartWritable__sci_VectorPointer__I__I__V($$this, index, xor) {
  if ((xor < 1024)) {
    if (($$this.depth__I() === 1)) {
      $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display1__AO().u[0] = $$this.display0__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO()
  } else if ((xor < 32768)) {
    if (($$this.depth__I() === 2)) {
      $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display2__AO().u[0] = $$this.display1__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO()
  } else if ((xor < 1048576)) {
    if (($$this.depth__I() === 3)) {
      $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display3__AO().u[0] = $$this.display2__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO()
  } else if ((xor < 33554432)) {
    if (($$this.depth__I() === 4)) {
      $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display4__AO().u[0] = $$this.display3__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO()
  } else if ((xor < 1073741824)) {
    if (($$this.depth__I() === 5)) {
      $$this.display5$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
      $$this.display5__AO().u[0] = $$this.display4__AO();
      $$this.depth$und$eq__I__V(((1 + $$this.depth__I()) | 0))
    };
    $$this.display0$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display2$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display3$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display4$und$eq__AO__V($newArrayObject($d_O.getArrayOf(), [32]));
    $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO();
    $$this.display5__AO().u[(31 & (index >> 25))] = $$this.display4__AO()
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_sci_VectorPointer$class__gotoPosWritable0__sci_VectorPointer__I__I__V($$this, newIndex, xor) {
  var x1 = (((-1) + $$this.depth__I()) | 0);
  switch (x1) {
    case 5: {
      var a = $$this.display5__AO();
      $$this.display5$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a));
      var array = $$this.display5__AO();
      var index = (31 & (newIndex >> 25));
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array, index));
      var array$1 = $$this.display4__AO();
      var index$1 = (31 & (newIndex >> 20));
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$1, index$1));
      var array$2 = $$this.display3__AO();
      var index$2 = (31 & (newIndex >> 15));
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$2, index$2));
      var array$3 = $$this.display2__AO();
      var index$3 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$3, index$3));
      var array$4 = $$this.display1__AO();
      var index$4 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$4, index$4));
      break
    }
    case 4: {
      var a$1 = $$this.display4__AO();
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$1));
      var array$5 = $$this.display4__AO();
      var index$5 = (31 & (newIndex >> 20));
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$5, index$5));
      var array$6 = $$this.display3__AO();
      var index$6 = (31 & (newIndex >> 15));
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$6, index$6));
      var array$7 = $$this.display2__AO();
      var index$7 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$7, index$7));
      var array$8 = $$this.display1__AO();
      var index$8 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$8, index$8));
      break
    }
    case 3: {
      var a$2 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$2));
      var array$9 = $$this.display3__AO();
      var index$9 = (31 & (newIndex >> 15));
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$9, index$9));
      var array$10 = $$this.display2__AO();
      var index$10 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$10, index$10));
      var array$11 = $$this.display1__AO();
      var index$11 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$11, index$11));
      break
    }
    case 2: {
      var a$3 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$3));
      var array$12 = $$this.display2__AO();
      var index$12 = (31 & (newIndex >> 10));
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$12, index$12));
      var array$13 = $$this.display1__AO();
      var index$13 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$13, index$13));
      break
    }
    case 1: {
      var a$4 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$4));
      var array$14 = $$this.display1__AO();
      var index$14 = (31 & (newIndex >> 5));
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$14, index$14));
      break
    }
    case 0: {
      var a$5 = $$this.display0__AO();
      $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$5));
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
}
function $s_sci_VectorPointer$class__stabilize__sci_VectorPointer__I__V($$this, index) {
  var x1 = (((-1) + $$this.depth__I()) | 0);
  switch (x1) {
    case 5: {
      var a = $$this.display5__AO();
      $$this.display5$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a));
      var a$1 = $$this.display4__AO();
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$1));
      var a$2 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$2));
      var a$3 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$3));
      var a$4 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$4));
      $$this.display5__AO().u[(31 & (index >> 25))] = $$this.display4__AO();
      $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO();
      $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 4: {
      var a$5 = $$this.display4__AO();
      $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$5));
      var a$6 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$6));
      var a$7 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$7));
      var a$8 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$8));
      $$this.display4__AO().u[(31 & (index >> 20))] = $$this.display3__AO();
      $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 3: {
      var a$9 = $$this.display3__AO();
      $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$9));
      var a$10 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$10));
      var a$11 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$11));
      $$this.display3__AO().u[(31 & (index >> 15))] = $$this.display2__AO();
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 2: {
      var a$12 = $$this.display2__AO();
      $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$12));
      var a$13 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$13));
      $$this.display2__AO().u[(31 & (index >> 10))] = $$this.display1__AO();
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 1: {
      var a$14 = $$this.display1__AO();
      $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$14));
      $$this.display1__AO().u[(31 & (index >> 5))] = $$this.display0__AO();
      break
    }
    case 0: {
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
}
function $s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array, index) {
  var x = array.u[index];
  array.u[index] = null;
  var a = $asArrayOf_O(x, 1);
  return $s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a)
}
function $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V($$this, that, depth) {
  $$this.depth$und$eq__I__V(depth);
  var x1 = (((-1) + depth) | 0);
  switch (x1) {
    case (-1): {
      break
    }
    case 0: {
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 1: {
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 2: {
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 3: {
      $$this.display3$und$eq__AO__V(that.display3__AO());
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 4: {
      $$this.display4$und$eq__AO__V(that.display4__AO());
      $$this.display3$und$eq__AO__V(that.display3__AO());
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    case 5: {
      $$this.display5$und$eq__AO__V(that.display5__AO());
      $$this.display4$und$eq__AO__V(that.display4__AO());
      $$this.display3$und$eq__AO__V(that.display3__AO());
      $$this.display2$und$eq__AO__V(that.display2__AO());
      $$this.display1$und$eq__AO__V(that.display1__AO());
      $$this.display0$und$eq__AO__V(that.display0__AO());
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
}
function $s_sci_VectorPointer$class__gotoNextBlockStart__sci_VectorPointer__I__I__V($$this, index, xor) {
  if ((xor < 1024)) {
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
  } else if ((xor < 32768)) {
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else if ((xor < 1048576)) {
    $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[0], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else if ((xor < 33554432)) {
    $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1));
    $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[0], 1));
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[0], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else if ((xor < 1073741824)) {
    $$this.display4$und$eq__AO__V($asArrayOf_O($$this.display5__AO().u[(31 & (index >> 25))], 1));
    $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[0], 1));
    $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[0], 1));
    $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[0], 1));
    $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[0], 1))
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_sci_VectorPointer$class__gotoPos__sci_VectorPointer__I__I__V($$this, index, xor) {
  if ((xor >= 32)) {
    if ((xor < 1024)) {
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 32768)) {
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 1048576)) {
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 33554432)) {
      $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1));
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else if ((xor < 1073741824)) {
      $$this.display4$und$eq__AO__V($asArrayOf_O($$this.display5__AO().u[(31 & (index >> 25))], 1));
      $$this.display3$und$eq__AO__V($asArrayOf_O($$this.display4__AO().u[(31 & (index >> 20))], 1));
      $$this.display2$und$eq__AO__V($asArrayOf_O($$this.display3__AO().u[(31 & (index >> 15))], 1));
      $$this.display1$und$eq__AO__V($asArrayOf_O($$this.display2__AO().u[(31 & (index >> 10))], 1));
      $$this.display0$und$eq__AO__V($asArrayOf_O($$this.display1__AO().u[(31 & (index >> 5))], 1))
    } else {
      throw new $c_jl_IllegalArgumentException().init___()
    }
  }
}
function $s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a) {
  var b = $newArrayObject($d_O.getArrayOf(), [a.u.length]);
  var length = a.u.length;
  $systemArraycopy(a, 0, b, 0, length);
  return b
}
function $s_sci_VectorPointer$class__gotoPosWritable1__sci_VectorPointer__I__I__I__V($$this, oldIndex, newIndex, xor) {
  if ((xor < 32)) {
    var a = $$this.display0__AO();
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a))
  } else if ((xor < 1024)) {
    var a$1 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$1));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    var array = $$this.display1__AO();
    var index = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array, index))
  } else if ((xor < 32768)) {
    var a$2 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$2));
    var a$3 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$3));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    var array$1 = $$this.display2__AO();
    var index$1 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$1, index$1));
    var array$2 = $$this.display1__AO();
    var index$2 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$2, index$2))
  } else if ((xor < 1048576)) {
    var a$4 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$4));
    var a$5 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$5));
    var a$6 = $$this.display3__AO();
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$6));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (oldIndex >> 15))] = $$this.display2__AO();
    var array$3 = $$this.display3__AO();
    var index$3 = (31 & (newIndex >> 15));
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$3, index$3));
    var array$4 = $$this.display2__AO();
    var index$4 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$4, index$4));
    var array$5 = $$this.display1__AO();
    var index$5 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$5, index$5))
  } else if ((xor < 33554432)) {
    var a$7 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$7));
    var a$8 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$8));
    var a$9 = $$this.display3__AO();
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$9));
    var a$10 = $$this.display4__AO();
    $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$10));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (oldIndex >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (oldIndex >> 20))] = $$this.display3__AO();
    var array$6 = $$this.display4__AO();
    var index$6 = (31 & (newIndex >> 20));
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$6, index$6));
    var array$7 = $$this.display3__AO();
    var index$7 = (31 & (newIndex >> 15));
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$7, index$7));
    var array$8 = $$this.display2__AO();
    var index$8 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$8, index$8));
    var array$9 = $$this.display1__AO();
    var index$9 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$9, index$9))
  } else if ((xor < 1073741824)) {
    var a$11 = $$this.display1__AO();
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$11));
    var a$12 = $$this.display2__AO();
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$12));
    var a$13 = $$this.display3__AO();
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$13));
    var a$14 = $$this.display4__AO();
    $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$14));
    var a$15 = $$this.display5__AO();
    $$this.display5$und$eq__AO__V($s_sci_VectorPointer$class__copyOf__sci_VectorPointer__AO__AO($$this, a$15));
    $$this.display1__AO().u[(31 & (oldIndex >> 5))] = $$this.display0__AO();
    $$this.display2__AO().u[(31 & (oldIndex >> 10))] = $$this.display1__AO();
    $$this.display3__AO().u[(31 & (oldIndex >> 15))] = $$this.display2__AO();
    $$this.display4__AO().u[(31 & (oldIndex >> 20))] = $$this.display3__AO();
    $$this.display5__AO().u[(31 & (oldIndex >> 25))] = $$this.display4__AO();
    var array$10 = $$this.display5__AO();
    var index$10 = (31 & (newIndex >> 25));
    $$this.display4$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$10, index$10));
    var array$11 = $$this.display4__AO();
    var index$11 = (31 & (newIndex >> 20));
    $$this.display3$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$11, index$11));
    var array$12 = $$this.display3__AO();
    var index$12 = (31 & (newIndex >> 15));
    $$this.display2$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$12, index$12));
    var array$13 = $$this.display2__AO();
    var index$13 = (31 & (newIndex >> 10));
    $$this.display1$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$13, index$13));
    var array$14 = $$this.display1__AO();
    var index$14 = (31 & (newIndex >> 5));
    $$this.display0$und$eq__AO__V($s_sci_VectorPointer$class__nullSlotAndCopy__sci_VectorPointer__AO__I__AO($$this, array$14, index$14))
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
}
function $s_scm_ArrayOps$class__copyToArray__scm_ArrayOps__O__I__I__V($$this, xs, start, len) {
  var y = $m_sr_ScalaRunTime$().array$undlength__O__I($$this.repr__O());
  var l = ((len < y) ? len : y);
  if (((($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0) < l)) {
    var x = (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0);
    l = ((x > 0) ? x : 0)
  };
  $m_s_Array$().copy__O__I__O__I__I__V($$this.repr__O(), 0, xs, start, l)
}
function $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__V($$this, coll) {
  if ($is_sc_IndexedSeqLike(coll)) {
    $$this.sizeHint__I__V(coll.size__I())
  }
}
function $s_scm_Builder$class__sizeHint__scm_Builder__sc_TraversableLike__I__V($$this, coll, delta) {
  if ($is_sc_IndexedSeqLike(coll)) {
    $$this.sizeHint__I__V(((coll.size__I() + delta) | 0))
  }
}
function $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V($$this, size, boundingColl) {
  if ($is_sc_IndexedSeqLike(boundingColl)) {
    var that = boundingColl.size__I();
    $$this.sizeHint__I__V(((size < that) ? size : that))
  }
}
function $s_scm_FlatHashTable$HashUtils$class__improve__scm_FlatHashTable$HashUtils__I__I__I($$this, hcode, seed) {
  var improved = $m_s_util_hashing_package$().byteswap32__I__I(hcode);
  var rotation = ((seed % 32) | 0);
  var rotated = (((improved >>> rotation) | 0) | (improved << ((32 - rotation) | 0)));
  return rotated
}
function $s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O($$this, entry) {
  return ((entry === $m_scm_FlatHashTable$NullSentinel$()) ? null : entry)
}
function $s_scm_FlatHashTable$HashUtils$class__elemToEntry__scm_FlatHashTable$HashUtils__O__O($$this, elem) {
  return ((elem === null) ? $m_scm_FlatHashTable$NullSentinel$() : elem)
}
function $s_scm_FlatHashTable$class__growTable__p0__scm_FlatHashTable__V($$this) {
  var oldtable = $$this.table$5;
  $$this.table$5 = $newArrayObject($d_O.getArrayOf(), [($$this.table$5.u.length << 1)]);
  $$this.tableSize$5 = 0;
  var tableLength = $$this.table$5.u.length;
  $s_scm_FlatHashTable$class__nnSizeMapReset__scm_FlatHashTable__I__V($$this, tableLength);
  $$this.seedvalue$5 = $s_scm_FlatHashTable$class__tableSizeSeed__scm_FlatHashTable__I($$this);
  $$this.threshold$5 = $m_scm_FlatHashTable$().newThreshold__I__I__I($$this.$$undloadFactor$5, $$this.table$5.u.length);
  var i = 0;
  while ((i < oldtable.u.length)) {
    var entry = oldtable.u[i];
    if ((entry !== null)) {
      $s_scm_FlatHashTable$class__addEntry__scm_FlatHashTable__O__Z($$this, entry)
    };
    i = ((1 + i) | 0)
  }
}
function $s_scm_FlatHashTable$class__removeElem__scm_FlatHashTable__O__Z($$this, elem) {
  var removalEntry = $s_scm_FlatHashTable$HashUtils$class__elemToEntry__scm_FlatHashTable$HashUtils__O__O($$this, elem);
  var hcode = $objectHashCode(removalEntry);
  var h = $s_scm_FlatHashTable$class__index__scm_FlatHashTable__I__I($$this, hcode);
  var curEntry = $$this.table$5.u[h];
  while ((curEntry !== null)) {
    if ($m_sr_BoxesRunTime$().equals__O__O__Z(curEntry, removalEntry)) {
      var h0 = h;
      var h1 = ((((1 + h0) | 0) % $$this.table$5.u.length) | 0);
      while (($$this.table$5.u[h1] !== null)) {
        var hcode$1 = $objectHashCode($$this.table$5.u[h1]);
        var h2 = $s_scm_FlatHashTable$class__index__scm_FlatHashTable__I__I($$this, hcode$1);
        if (((h2 !== h1) && $s_scm_FlatHashTable$class__precedes$1__p0__scm_FlatHashTable__I__I__Z($$this, h2, h0))) {
          $$this.table$5.u[h0] = $$this.table$5.u[h1];
          h0 = h1
        };
        h1 = ((((1 + h1) | 0) % $$this.table$5.u.length) | 0)
      };
      $$this.table$5.u[h0] = null;
      $$this.tableSize$5 = (((-1) + $$this.tableSize$5) | 0);
      var h$1 = h0;
      $s_scm_FlatHashTable$class__nnSizeMapRemove__scm_FlatHashTable__I__V($$this, h$1);
      return true
    };
    h = ((((1 + h) | 0) % $$this.table$5.u.length) | 0);
    curEntry = $$this.table$5.u[h]
  };
  return false
}
function $s_scm_FlatHashTable$class__calcSizeMapSize__scm_FlatHashTable__I__I($$this, tableLength) {
  return ((1 + (tableLength >> 5)) | 0)
}
function $s_scm_FlatHashTable$class__nnSizeMapAdd__scm_FlatHashTable__I__V($$this, h) {
  if (($$this.sizemap$5 !== null)) {
    var p = (h >> 5);
    var ev$1 = $$this.sizemap$5;
    ev$1.u[p] = ((1 + ev$1.u[p]) | 0)
  }
}
function $s_scm_FlatHashTable$class__nnSizeMapRemove__scm_FlatHashTable__I__V($$this, h) {
  if (($$this.sizemap$5 !== null)) {
    var ev$2 = $$this.sizemap$5;
    var ev$3 = (h >> 5);
    ev$2.u[ev$3] = (((-1) + ev$2.u[ev$3]) | 0)
  }
}
function $s_scm_FlatHashTable$class__$$init$__scm_FlatHashTable__V($$this) {
  $$this.$$undloadFactor$5 = 450;
  $$this.table$5 = $newArrayObject($d_O.getArrayOf(), [$s_scm_FlatHashTable$class__capacity__scm_FlatHashTable__I__I($$this, 32)]);
  $$this.tableSize$5 = 0;
  $$this.threshold$5 = $m_scm_FlatHashTable$().newThreshold__I__I__I($$this.$$undloadFactor$5, $s_scm_FlatHashTable$class__capacity__scm_FlatHashTable__I__I($$this, 32));
  $$this.sizemap$5 = null;
  $$this.seedvalue$5 = $s_scm_FlatHashTable$class__tableSizeSeed__scm_FlatHashTable__I($$this)
}
function $s_scm_FlatHashTable$class__findElemImpl__p0__scm_FlatHashTable__O__O($$this, elem) {
  var searchEntry = $s_scm_FlatHashTable$HashUtils$class__elemToEntry__scm_FlatHashTable$HashUtils__O__O($$this, elem);
  var hcode = $objectHashCode(searchEntry);
  var h = $s_scm_FlatHashTable$class__index__scm_FlatHashTable__I__I($$this, hcode);
  var curEntry = $$this.table$5.u[h];
  while (((curEntry !== null) && (!$m_sr_BoxesRunTime$().equals__O__O__Z(curEntry, searchEntry)))) {
    h = ((((1 + h) | 0) % $$this.table$5.u.length) | 0);
    curEntry = $$this.table$5.u[h]
  };
  return curEntry
}
function $s_scm_FlatHashTable$class__addEntry__scm_FlatHashTable__O__Z($$this, newEntry) {
  var hcode = $objectHashCode(newEntry);
  var h = $s_scm_FlatHashTable$class__index__scm_FlatHashTable__I__I($$this, hcode);
  var curEntry = $$this.table$5.u[h];
  while ((curEntry !== null)) {
    if ($m_sr_BoxesRunTime$().equals__O__O__Z(curEntry, newEntry)) {
      return false
    };
    h = ((((1 + h) | 0) % $$this.table$5.u.length) | 0);
    curEntry = $$this.table$5.u[h]
  };
  $$this.table$5.u[h] = newEntry;
  $$this.tableSize$5 = ((1 + $$this.tableSize$5) | 0);
  var h$1 = h;
  $s_scm_FlatHashTable$class__nnSizeMapAdd__scm_FlatHashTable__I__V($$this, h$1);
  if (($$this.tableSize$5 >= $$this.threshold$5)) {
    $s_scm_FlatHashTable$class__growTable__p0__scm_FlatHashTable__V($$this)
  };
  return true
}
function $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z($$this, elem) {
  var newEntry = $s_scm_FlatHashTable$HashUtils$class__elemToEntry__scm_FlatHashTable$HashUtils__O__O($$this, elem);
  return $s_scm_FlatHashTable$class__addEntry__scm_FlatHashTable__O__Z($$this, newEntry)
}
function $s_scm_FlatHashTable$class__index__scm_FlatHashTable__I__I($$this, hcode) {
  var seed = $$this.seedvalue$5;
  var improved = $s_scm_FlatHashTable$HashUtils$class__improve__scm_FlatHashTable$HashUtils__I__I__I($$this, hcode, seed);
  var ones = (((-1) + $$this.table$5.u.length) | 0);
  return (((improved >>> ((32 - $m_jl_Integer$().bitCount__I__I(ones)) | 0)) | 0) & ones)
}
function $s_scm_FlatHashTable$class__precedes$1__p0__scm_FlatHashTable__I__I__Z($$this, i, j) {
  var d = ($$this.table$5.u.length >> 1);
  return ((i <= j) ? (((j - i) | 0) < d) : (((i - j) | 0) > d))
}
function $s_scm_FlatHashTable$class__tableSizeSeed__scm_FlatHashTable__I($$this) {
  return $m_jl_Integer$().bitCount__I__I((((-1) + $$this.table$5.u.length) | 0))
}
function $s_scm_FlatHashTable$class__capacity__scm_FlatHashTable__I__I($$this, expectedSize) {
  return ((expectedSize === 0) ? 1 : $m_scm_HashTable$().powerOfTwo__I__I(expectedSize))
}
function $s_scm_FlatHashTable$class__nnSizeMapReset__scm_FlatHashTable__I__V($$this, tableLength) {
  if (($$this.sizemap$5 !== null)) {
    var nsize = $s_scm_FlatHashTable$class__calcSizeMapSize__scm_FlatHashTable__I__I($$this, tableLength);
    if (($$this.sizemap$5.u.length !== nsize)) {
      $$this.sizemap$5 = $newArrayObject($d_I.getArrayOf(), [nsize])
    } else {
      $m_ju_Arrays$().fill__AI__I__V($$this.sizemap$5, 0)
    }
  }
}
function $s_scm_FlatHashTable$class__initWithContents__scm_FlatHashTable__scm_FlatHashTable$Contents__V($$this, c) {
  if ((c !== null)) {
    $$this.$$undloadFactor$5 = c.loadFactor__I();
    $$this.table$5 = c.table__AO();
    $$this.tableSize$5 = c.tableSize__I();
    $$this.threshold$5 = c.threshold__I();
    $$this.seedvalue$5 = c.seedvalue__I();
    $$this.sizemap$5 = c.sizemap__AI()
  }
}
function $s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z($$this, elem) {
  return ($s_scm_FlatHashTable$class__findElemImpl__p0__scm_FlatHashTable__O__O($$this, elem) !== null)
}
function $is_scm_HashEntry(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_HashEntry)))
}
function $as_scm_HashEntry(obj) {
  return (($is_scm_HashEntry(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.HashEntry"))
}
function $isArrayOf_scm_HashEntry(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_HashEntry)))
}
function $asArrayOf_scm_HashEntry(obj, depth) {
  return (($isArrayOf_scm_HashEntry(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.HashEntry;", depth))
}
var $d_scm_HashEntry = new $TypeData().initClass({
  scm_HashEntry: 0
}, true, "scala.collection.mutable.HashEntry", {
  scm_HashEntry: 1
});
function $s_scm_HashTable$HashUtils$class__improve__scm_HashTable$HashUtils__I__I__I($$this, hcode, seed) {
  var i = $m_s_util_hashing_package$().byteswap32__I__I(hcode);
  var rotation = ((seed % 32) | 0);
  var rotated = (((i >>> rotation) | 0) | (i << ((32 - rotation) | 0)));
  return rotated
}
function $s_scm_HashTable$class__initWithContents__scm_HashTable__scm_HashTable$Contents__V($$this, c) {
  if ((c !== null)) {
    $$this.$$undloadFactor$5 = c.loadFactor__I();
    $$this.table$5 = c.table__Ascm_HashEntry();
    $$this.tableSize$5 = c.tableSize__I();
    $$this.threshold$5 = c.threshold__I();
    $$this.seedvalue$5 = c.seedvalue__I();
    $$this.sizemap$5 = c.sizemap__AI()
  }
}
function $s_scm_HashTable$class__scala$collection$mutable$HashTable$$lastPopulatedIndex__scm_HashTable__I($$this) {
  var idx = (((-1) + $$this.table$5.u.length) | 0);
  while ((($$this.table$5.u[idx] === null) && (idx > 0))) {
    idx = (((-1) + idx) | 0)
  };
  return idx
}
function $s_scm_HashTable$class__findEntry__scm_HashTable__O__scm_HashEntry($$this, key) {
  var hcode = $m_sr_ScalaRunTime$().hash__O__I(key);
  return $s_scm_HashTable$class__scala$collection$mutable$HashTable$$findEntry0__scm_HashTable__O__I__scm_HashEntry($$this, key, $s_scm_HashTable$class__index__scm_HashTable__I__I($$this, hcode))
}
function $s_scm_HashTable$class__scala$collection$mutable$HashTable$$findEntry0__scm_HashTable__O__I__scm_HashEntry($$this, key, h) {
  var e = $$this.table$5.u[h];
  while (true) {
    if ((e !== null)) {
      var key1 = e.key$1;
      var jsx$1 = (!$m_sr_BoxesRunTime$().equals__O__O__Z(key1, key))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      e = $as_scm_HashEntry(e.next$1)
    } else {
      break
    }
  };
  return e
}
function $s_scm_HashTable$class__nnSizeMapAdd__scm_HashTable__I__V($$this, h) {
  if (($$this.sizemap$5 !== null)) {
    var ev$1 = $$this.sizemap$5;
    var ev$2 = (h >> 5);
    ev$1.u[ev$2] = ((1 + ev$1.u[ev$2]) | 0)
  }
}
function $s_scm_HashTable$class__calcSizeMapSize__scm_HashTable__I__I($$this, tableLength) {
  return ((1 + (tableLength >> 5)) | 0)
}
function $s_scm_HashTable$class__resize__p0__scm_HashTable__I__V($$this, newSize) {
  var oldTable = $$this.table$5;
  $$this.table$5 = $newArrayObject($d_scm_HashEntry.getArrayOf(), [newSize]);
  var tableLength = $$this.table$5.u.length;
  $s_scm_HashTable$class__nnSizeMapReset__scm_HashTable__I__V($$this, tableLength);
  var i = (((-1) + oldTable.u.length) | 0);
  while ((i >= 0)) {
    var e = oldTable.u[i];
    while ((e !== null)) {
      var key = e.key$1;
      var hcode = $m_sr_ScalaRunTime$().hash__O__I(key);
      var h = $s_scm_HashTable$class__index__scm_HashTable__I__I($$this, hcode);
      var e1 = $as_scm_HashEntry(e.next$1);
      e.next$1 = $$this.table$5.u[h];
      $$this.table$5.u[h] = e;
      e = e1;
      $s_scm_HashTable$class__nnSizeMapAdd__scm_HashTable__I__V($$this, h)
    };
    i = (((-1) + i) | 0)
  };
  $$this.threshold$5 = $m_scm_HashTable$().newThreshold__I__I__I($$this.$$undloadFactor$5, newSize)
}
function $s_scm_HashTable$class__$$init$__scm_HashTable__V($$this) {
  $$this.$$undloadFactor$5 = 750;
  $$this.table$5 = $newArrayObject($d_scm_HashEntry.getArrayOf(), [$m_scm_HashTable$().capacity__I__I(16)]);
  $$this.tableSize$5 = 0;
  $$this.threshold$5 = $s_scm_HashTable$class__initialThreshold__p0__scm_HashTable__I__I($$this, $$this.$$undloadFactor$5);
  $$this.sizemap$5 = null;
  $$this.seedvalue$5 = $s_scm_HashTable$class__tableSizeSeed__scm_HashTable__I($$this)
}
function $s_scm_HashTable$class__index__scm_HashTable__I__I($$this, hcode) {
  var ones = (((-1) + $$this.table$5.u.length) | 0);
  var seed = $$this.seedvalue$5;
  var improved = $s_scm_HashTable$HashUtils$class__improve__scm_HashTable$HashUtils__I__I__I($$this, hcode, seed);
  var shifted = ((improved >> ((32 - $m_jl_Integer$().bitCount__I__I(ones)) | 0)) & ones);
  return shifted
}
function $s_scm_HashTable$class__scala$collection$mutable$HashTable$$addEntry0__scm_HashTable__scm_HashEntry__I__V($$this, e, h) {
  e.next$1 = $$this.table$5.u[h];
  $$this.table$5.u[h] = e;
  $$this.tableSize$5 = ((1 + $$this.tableSize$5) | 0);
  $s_scm_HashTable$class__nnSizeMapAdd__scm_HashTable__I__V($$this, h);
  if (($$this.tableSize$5 > $$this.threshold$5)) {
    $s_scm_HashTable$class__resize__p0__scm_HashTable__I__V($$this, ($$this.table$5.u.length << 1))
  }
}
function $s_scm_HashTable$class__initialThreshold__p0__scm_HashTable__I__I($$this, _loadFactor) {
  return $m_scm_HashTable$().newThreshold__I__I__I(_loadFactor, $m_scm_HashTable$().capacity__I__I(16))
}
function $s_scm_HashTable$class__findOrAddEntry__scm_HashTable__O__O__scm_HashEntry($$this, key, value) {
  var hcode = $m_sr_ScalaRunTime$().hash__O__I(key);
  var h = $s_scm_HashTable$class__index__scm_HashTable__I__I($$this, hcode);
  var e = $s_scm_HashTable$class__scala$collection$mutable$HashTable$$findEntry0__scm_HashTable__O__I__scm_HashEntry($$this, key, h);
  return ((e !== null) ? e : ($s_scm_HashTable$class__scala$collection$mutable$HashTable$$addEntry0__scm_HashTable__scm_HashEntry__I__V($$this, new $c_scm_DefaultEntry().init___O__O(key, value), h), null))
}
function $s_scm_HashTable$class__nnSizeMapReset__scm_HashTable__I__V($$this, tableLength) {
  if (($$this.sizemap$5 !== null)) {
    var nsize = $s_scm_HashTable$class__calcSizeMapSize__scm_HashTable__I__I($$this, tableLength);
    if (($$this.sizemap$5.u.length !== nsize)) {
      $$this.sizemap$5 = $newArrayObject($d_I.getArrayOf(), [nsize])
    } else {
      $m_ju_Arrays$().fill__AI__I__V($$this.sizemap$5, 0)
    }
  }
}
function $s_scm_HashTable$class__tableSizeSeed__scm_HashTable__I($$this) {
  return $m_jl_Integer$().bitCount__I__I((((-1) + $$this.table$5.u.length) | 0))
}
function $s_scm_ResizableArray$class__copyToArray__scm_ResizableArray__O__I__I__V($$this, xs, start, len) {
  var that = (($m_sr_ScalaRunTime$().array$undlength__O__I(xs) - start) | 0);
  var x = ((len < that) ? len : that);
  var that$1 = $$this.size0$6;
  var len1 = ((x < that$1) ? x : that$1);
  $m_s_Array$().copy__O__I__O__I__I__V($$this.array$6, 0, xs, start, len1)
}
function $s_scm_ResizableArray$class__ensureSize__scm_ResizableArray__I__V($$this, n) {
  var value = $$this.array$6.u.length;
  var hi = (value >> 31);
  var hi$1 = (n >> 31);
  if (((hi$1 === hi) ? (((-2147483648) ^ n) > ((-2147483648) ^ value)) : (hi$1 > hi))) {
    var lo = (value << 1);
    var hi$2 = (((value >>> 31) | 0) | (hi << 1));
    var newSize_$_lo$2 = lo;
    var newSize_$_hi$2 = hi$2;
    while (true) {
      var hi$3 = (n >> 31);
      var b_$_lo$2 = newSize_$_lo$2;
      var b_$_hi$2 = newSize_$_hi$2;
      var bhi = b_$_hi$2;
      if (((hi$3 === bhi) ? (((-2147483648) ^ n) > ((-2147483648) ^ b_$_lo$2)) : (hi$3 > bhi))) {
        var this$1_$_lo$2 = newSize_$_lo$2;
        var this$1_$_hi$2 = newSize_$_hi$2;
        var lo$1 = (this$1_$_lo$2 << 1);
        var hi$4 = (((this$1_$_lo$2 >>> 31) | 0) | (this$1_$_hi$2 << 1));
        var jsx$1_$_lo$2 = lo$1;
        var jsx$1_$_hi$2 = hi$4;
        newSize_$_lo$2 = jsx$1_$_lo$2;
        newSize_$_hi$2 = jsx$1_$_hi$2
      } else {
        break
      }
    };
    var this$2_$_lo$2 = newSize_$_lo$2;
    var this$2_$_hi$2 = newSize_$_hi$2;
    var ahi = this$2_$_hi$2;
    if (((ahi === 0) ? (((-2147483648) ^ this$2_$_lo$2) > (-1)) : (ahi > 0))) {
      var jsx$2_$_lo$2 = 2147483647;
      var jsx$2_$_hi$2 = 0;
      newSize_$_lo$2 = jsx$2_$_lo$2;
      newSize_$_hi$2 = jsx$2_$_hi$2
    };
    var this$3_$_lo$2 = newSize_$_lo$2;
    var this$3_$_hi$2 = newSize_$_hi$2;
    var newArray = $newArrayObject($d_O.getArrayOf(), [this$3_$_lo$2]);
    var src = $$this.array$6;
    var length = $$this.size0$6;
    $systemArraycopy(src, 0, newArray, 0, length);
    $$this.array$6 = newArray
  }
}
function $s_scm_ResizableArray$class__foreach__scm_ResizableArray__F1__V($$this, f) {
  var i = 0;
  var top = $$this.size0$6;
  while ((i < top)) {
    f.apply__O__O($$this.array$6.u[i]);
    i = ((1 + i) | 0)
  }
}
function $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O($$this, idx) {
  if ((idx >= $$this.size0$6)) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + idx))
  };
  return $$this.array$6.u[idx]
}
function $s_scm_ResizableArray$class__reduceToSize__scm_ResizableArray__I__V($$this, sz) {
  $m_s_Predef$().require__Z__V((sz <= $$this.size0$6));
  while (($$this.size0$6 > sz)) {
    $$this.size0$6 = (((-1) + $$this.size0$6) | 0);
    $$this.array$6.u[$$this.size0$6] = null
  }
}
function $s_scm_ResizableArray$class__$$init$__scm_ResizableArray__V($$this) {
  var x = $$this.initialSize$6;
  $$this.array$6 = $newArrayObject($d_O.getArrayOf(), [((x > 1) ? x : 1)]);
  $$this.size0$6 = 0
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_EntityExtensions$() {
  $c_O.call(this);
  this.com$darkoverlordofdata$demo$EntityExtensions$$boundsComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$bulletComponent$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$destroyComponent$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$enemyComponent$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$expiresComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$firingComponent$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$healthComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$layerComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$playerComponent$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$positionComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$resourceComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$scaleComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$scoreComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$soundEffectComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$tintComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$tweenComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$velocityComponentPool$1 = null;
  this.com$darkoverlordofdata$demo$EntityExtensions$$viewComponentPool$1 = null
}
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_EntityExtensions$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_EntityExtensions$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_EntityExtensions$.prototype = $c_Lcom_darkoverlordofdata_demo_EntityExtensions$.prototype;
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$.prototype.init___ = (function() {
  $n_Lcom_darkoverlordofdata_demo_EntityExtensions$ = this;
  this.com$darkoverlordofdata$demo$EntityExtensions$$boundsComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$bulletComponent$1 = new $c_Lcom_darkoverlordofdata_demo_BulletComponent().init___Z(true);
  this.com$darkoverlordofdata$demo$EntityExtensions$$destroyComponent$1 = new $c_Lcom_darkoverlordofdata_demo_DestroyComponent().init___Z(true);
  this.com$darkoverlordofdata$demo$EntityExtensions$$enemyComponent$1 = new $c_Lcom_darkoverlordofdata_demo_EnemyComponent().init___Z(true);
  this.com$darkoverlordofdata$demo$EntityExtensions$$expiresComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$firingComponent$1 = new $c_Lcom_darkoverlordofdata_demo_FiringComponent().init___Z(true);
  this.com$darkoverlordofdata$demo$EntityExtensions$$healthComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$layerComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$playerComponent$1 = new $c_Lcom_darkoverlordofdata_demo_PlayerComponent().init___Z(true);
  this.com$darkoverlordofdata$demo$EntityExtensions$$positionComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$resourceComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$scaleComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$scoreComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$soundEffectComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$tintComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$tweenComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$velocityComponentPool$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$demo$EntityExtensions$$viewComponentPool$1 = new $c_scm_ListBuffer().init___();
  return this
});
var $d_Lcom_darkoverlordofdata_demo_EntityExtensions$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_EntityExtensions$: 0
}, false, "com.darkoverlordofdata.demo.EntityExtensions$", {
  Lcom_darkoverlordofdata_demo_EntityExtensions$: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_EntityExtensions$;
var $n_Lcom_darkoverlordofdata_demo_EntityExtensions$ = (void 0);
function $m_Lcom_darkoverlordofdata_demo_EntityExtensions$() {
  if ((!$n_Lcom_darkoverlordofdata_demo_EntityExtensions$)) {
    $n_Lcom_darkoverlordofdata_demo_EntityExtensions$ = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$().init___()
  };
  return $n_Lcom_darkoverlordofdata_demo_EntityExtensions$
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity() {
  $c_O.call(this);
  this.entity$1 = null
}
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype = $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype;
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.velocity__Lcom_darkoverlordofdata_demo_VelocityComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_VelocityComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().Velocity$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addSoundEffect__I__Lcom_darkoverlordofdata_entitas_Entity = (function(effect) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$soundEffectComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$soundEffectComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_SoundEffectComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_SoundEffectComponent().init___I(effect)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_SoundEffectComponent().init___I(effect)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().SoundEffect$2.i$2, component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addTint__F__F__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(r, g, b, a) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$tintComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$tintComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_TintComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_TintComponent().init___F__F__F__F(r, g, b, a)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_TintComponent().init___F__F__F__F(r, g, b, a)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Tint$2.i$2, component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.updateScale__Lcom_darkoverlordofdata_demo_ScaleComponent__Lcom_darkoverlordofdata_entitas_Entity = (function(component) {
  return this.entity$1.updateComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Scale$2.i$2, component)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.health__Lcom_darkoverlordofdata_demo_HealthComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_HealthComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().Health$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addPosition__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(x, y) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$positionComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$positionComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_PositionComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_PositionComponent().init___F__F(x, y)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_PositionComponent().init___F__F(x, y)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Position$2.i$2, component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.hasScale__Z = (function() {
  return this.entity$1.hasComponent__I__Z($m_Lcom_darkoverlordofdata_demo_Component$().Scale$2.i$2)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.setPlayer__Z__Lcom_darkoverlordofdata_entitas_Entity = (function(value) {
  if ((value !== this.isPlayer__Z())) {
    this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Player$2.i$2, $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$playerComponent$1)
  } else {
    this.entity$1.removeComponent__I__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Player$2.i$2)
  };
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.scale__Lcom_darkoverlordofdata_demo_ScaleComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_ScaleComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().Scale$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.init___Lcom_darkoverlordofdata_entitas_Entity = (function(entity) {
  this.entity$1 = entity;
  return this
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.setEnemy__Z__Lcom_darkoverlordofdata_entitas_Entity = (function(value) {
  if ((value !== this.isEnemy__Z())) {
    this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Enemy$2.i$2, $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$enemyComponent$1)
  } else {
    this.entity$1.removeComponent__I__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Enemy$2.i$2)
  };
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.expires__Lcom_darkoverlordofdata_demo_ExpiresComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_ExpiresComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().Expires$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.updateHealth__Lcom_darkoverlordofdata_demo_HealthComponent__Lcom_darkoverlordofdata_entitas_Entity = (function(component) {
  return this.entity$1.updateComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Health$2.i$2, component)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.updateTween__Lcom_darkoverlordofdata_demo_TweenComponent__Lcom_darkoverlordofdata_entitas_Entity = (function(component) {
  return this.entity$1.updateComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Tween$2.i$2, component)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.updatePosition__Lcom_darkoverlordofdata_demo_PositionComponent__Lcom_darkoverlordofdata_entitas_Entity = (function(component) {
  return this.entity$1.updateComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Position$2.i$2, component)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.bounds__Lcom_darkoverlordofdata_demo_BoundsComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_BoundsComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().Bounds$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.tint__Lcom_darkoverlordofdata_demo_TintComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_TintComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().Tint$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addTween__F__F__F__Z__Z__Lcom_darkoverlordofdata_entitas_Entity = (function(min, max, speed, repeat, active) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$tweenComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$tweenComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_TweenComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_TweenComponent().init___F__F__F__Z__Z(min, max, speed, repeat, active)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_TweenComponent().init___F__F__F__Z__Z(min, max, speed, repeat, active)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Tween$2.i$2, component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addScale__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(x, y) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$scaleComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$scaleComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_ScaleComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_ScaleComponent().init___F__F(x, y)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_ScaleComponent().init___F__F(x, y)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Scale$2.i$2, component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.layer__Lcom_darkoverlordofdata_demo_LayerComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_LayerComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().Layer$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addVelocity__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(x, y) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$velocityComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$velocityComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_VelocityComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_VelocityComponent().init___F__F(x, y)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_VelocityComponent().init___F__F(x, y)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Velocity$2.i$2, component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.score__Lcom_darkoverlordofdata_demo_ScoreComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_ScoreComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().Score$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.soundEffect__Lcom_darkoverlordofdata_demo_SoundEffectComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_SoundEffectComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().SoundEffect$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.hasPosition__Z = (function() {
  return this.entity$1.hasComponent__I__Z($m_Lcom_darkoverlordofdata_demo_Component$().Position$2.i$2)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addView__Lcom_badlogic_gdx_graphics_g2d_Sprite__Lcom_darkoverlordofdata_entitas_Entity = (function(sprite) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$viewComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$viewComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_ViewComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_ViewComponent().init___Lcom_badlogic_gdx_graphics_g2d_Sprite(sprite)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_ViewComponent().init___Lcom_badlogic_gdx_graphics_g2d_Sprite(sprite)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().View$2.i$2, component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.view__Lcom_darkoverlordofdata_demo_ViewComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_ViewComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().View$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addExpires__F__Lcom_darkoverlordofdata_entitas_Entity = (function(delay) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$expiresComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$expiresComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_ExpiresComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_ExpiresComponent().init___F(delay)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_ExpiresComponent().init___F(delay)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Expires$2.i$2, component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.position__Lcom_darkoverlordofdata_demo_PositionComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_PositionComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().Position$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addScore__I__Lcom_darkoverlordofdata_entitas_Entity = (function(value) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$scoreComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$scoreComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_ScoreComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_ScoreComponent().init___I(value)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_ScoreComponent().init___I(value)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Score$2.i$2, component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.isDestroy__Z = (function() {
  return this.entity$1.hasComponent__I__Z($m_Lcom_darkoverlordofdata_demo_Component$().Destroy$2.i$2)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.isPlayer__Z = (function() {
  return this.entity$1.hasComponent__I__Z($m_Lcom_darkoverlordofdata_demo_Component$().Player$2.i$2)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.setBullet__Z__Lcom_darkoverlordofdata_entitas_Entity = (function(value) {
  if ((value !== this.isBullet__Z())) {
    this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Bullet$2.i$2, $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$bulletComponent$1)
  } else {
    this.entity$1.removeComponent__I__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Bullet$2.i$2)
  };
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addHealth__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(currentHealth, maximumHealth) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$healthComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$healthComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_HealthComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_HealthComponent().init___F__F(currentHealth, maximumHealth)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_HealthComponent().init___F__F(currentHealth, maximumHealth)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Health$2.i$2, component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.updateScore__Lcom_darkoverlordofdata_demo_ScoreComponent__Lcom_darkoverlordofdata_entitas_Entity = (function(component) {
  return this.entity$1.updateComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Score$2.i$2, component)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.hasTint__Z = (function() {
  return this.entity$1.hasComponent__I__Z($m_Lcom_darkoverlordofdata_demo_Component$().Tint$2.i$2)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.updateExpires__Lcom_darkoverlordofdata_demo_ExpiresComponent__Lcom_darkoverlordofdata_entitas_Entity = (function(component) {
  return this.entity$1.updateComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Expires$2.i$2, component)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.isEnemy__Z = (function() {
  return this.entity$1.hasComponent__I__Z($m_Lcom_darkoverlordofdata_demo_Component$().Enemy$2.i$2)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.isBullet__Z = (function() {
  return this.entity$1.hasComponent__I__Z($m_Lcom_darkoverlordofdata_demo_Component$().Bullet$2.i$2)
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addBounds__F__Lcom_darkoverlordofdata_entitas_Entity = (function(radius) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$boundsComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$boundsComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_BoundsComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_BoundsComponent().init___F(radius)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_BoundsComponent().init___F(radius)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Bounds$2.i$2, component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.setDestroy__Z__Lcom_darkoverlordofdata_entitas_Entity = (function(value) {
  if ((value !== this.isDestroy__Z())) {
    this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Destroy$2.i$2, $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$destroyComponent$1)
  } else {
    this.entity$1.removeComponent__I__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Destroy$2.i$2)
  };
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.removeSoundEffect__Lcom_darkoverlordofdata_entitas_Entity = (function() {
  var component = this.soundEffect__Lcom_darkoverlordofdata_demo_SoundEffectComponent();
  this.entity$1.removeComponent__I__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().SoundEffect$2.i$2);
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$soundEffectComponentPool$1.$$plus$eq__O__scm_ListBuffer(component);
  return this.entity$1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.tween__Lcom_darkoverlordofdata_demo_TweenComponent = (function() {
  return $as_Lcom_darkoverlordofdata_demo_TweenComponent(this.entity$1.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent($m_Lcom_darkoverlordofdata_demo_Component$().Tween$2.i$2))
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.addLayer__I__Lcom_darkoverlordofdata_entitas_Entity = (function(ordinal) {
  var this$1 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$layerComponentPool$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var this$3 = $m_Lcom_darkoverlordofdata_demo_EntityExtensions$().com$darkoverlordofdata$demo$EntityExtensions$$layerComponentPool$1;
    var this$4 = this$3.scala$collection$mutable$ListBuffer$$start$6;
    $as_Lcom_darkoverlordofdata_demo_LayerComponent($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$4));
    var component = new $c_Lcom_darkoverlordofdata_demo_LayerComponent().init___I(ordinal)
  } else {
    var component = new $c_Lcom_darkoverlordofdata_demo_LayerComponent().init___I(ordinal)
  };
  this.entity$1.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_Component$().Layer$2.i$2, component);
  return this.entity$1
});
var $d_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity: 0
}, false, "com.darkoverlordofdata.demo.EntityExtensions$ExtendEntity", {
  Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory() {
  $c_O.call(this);
  this.pool$1 = null;
  this.Random$1 = null
}
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_Factory$EntityFactory() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype = $c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype;
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype.createEnemy2__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(width, height) {
  var entity = this.prefab__T__Lcom_darkoverlordofdata_entitas_Entity("enemy2");
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  var entity$1 = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).addHealth__F__F__Lcom_darkoverlordofdata_entitas_Entity(20.0, 20.0);
  var entity$2 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$1).addPosition__F__F__Lcom_darkoverlordofdata_entitas_Entity($fround((this.Random$1.nextFloat__F() * width)), $fround((height - ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).bounds__Lcom_darkoverlordofdata_demo_BoundsComponent().radius$1)));
  var entity$3 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$2).addVelocity__F__F__Lcom_darkoverlordofdata_entitas_Entity(0.0, 30.0);
  new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$3).setEnemy__Z__Lcom_darkoverlordofdata_entitas_Entity(true);
  return entity
});
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype.createSmallExplosion__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(x, y) {
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  var entity = this.prefab__T__Lcom_darkoverlordofdata_entitas_Entity("bang");
  var entity$1 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity).addExpires__F__Lcom_darkoverlordofdata_entitas_Entity(0.5);
  var entity$2 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$1).addPosition__F__F__Lcom_darkoverlordofdata_entitas_Entity(x, y);
  var entity$3 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$2).addScale__F__F__Lcom_darkoverlordofdata_entitas_Entity(1.0, 1.0);
  var entity$4 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$3).addSoundEffect__I__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_O2dLibrary$().getSoundEffect__T__I("bang"));
  var entity$5 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$4).addTint__F__F__F__F__Lcom_darkoverlordofdata_entitas_Entity(1.0, 1.0, 0.15294118225574493, 0.5);
  var entity$6 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$5).addTween__F__F__F__Z__Z__Lcom_darkoverlordofdata_entitas_Entity(0.009999999776482582, 1.0, (-3.0), false, true);
  return entity$6
});
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype.prefab__T__Lcom_darkoverlordofdata_entitas_Entity = (function(name) {
  var sprite = $m_Lcom_darkoverlordofdata_demo_O2dLibrary$().getSprite__T__Lcom_badlogic_gdx_graphics_g2d_Sprite(name);
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  var entity = this.pool$1.createEntity__T__Lcom_darkoverlordofdata_entitas_Entity(name);
  var entity$1 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity).addLayer__I__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_O2dLibrary$().getLayer__T__I(name));
  var entity$2 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$1).addBounds__F__Lcom_darkoverlordofdata_entitas_Entity($fround((($uI(sprite.getWidth()) / 4) | 0)));
  var entity$3 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$2).addView__Lcom_badlogic_gdx_graphics_g2d_Sprite__Lcom_darkoverlordofdata_entitas_Entity(sprite);
  return entity$3
});
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype.createEnemy3__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(width, height) {
  var entity = this.prefab__T__Lcom_darkoverlordofdata_entitas_Entity("enemy3");
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  var entity$1 = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).addHealth__F__F__Lcom_darkoverlordofdata_entitas_Entity(60.0, 60.0);
  var entity$2 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$1).addPosition__F__F__Lcom_darkoverlordofdata_entitas_Entity($fround((this.Random$1.nextFloat__F() * width)), $fround((height - ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).bounds__Lcom_darkoverlordofdata_demo_BoundsComponent().radius$1)));
  var entity$3 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$2).addVelocity__F__F__Lcom_darkoverlordofdata_entitas_Entity(0.0, 10.0);
  new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$3).setEnemy__Z__Lcom_darkoverlordofdata_entitas_Entity(true);
  return entity
});
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype.createBigExplosion__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(x, y) {
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  var entity = this.prefab__T__Lcom_darkoverlordofdata_entitas_Entity("explosion");
  var entity$1 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity).addExpires__F__Lcom_darkoverlordofdata_entitas_Entity(0.5);
  var entity$2 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$1).addPosition__F__F__Lcom_darkoverlordofdata_entitas_Entity(x, y);
  var entity$3 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$2).addScale__F__F__Lcom_darkoverlordofdata_entitas_Entity(0.5, 0.5);
  var entity$4 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$3).addSoundEffect__I__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_O2dLibrary$().getSoundEffect__T__I("explosion"));
  var entity$5 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$4).addTint__F__F__F__F__Lcom_darkoverlordofdata_entitas_Entity(1.0, 1.0, 0.15294118225574493, 0.5);
  var entity$6 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$5).addTween__F__F__F__Z__Z__Lcom_darkoverlordofdata_entitas_Entity(0.004999999888241291, 0.5, (-3.0), false, true);
  return entity$6
});
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype.createEnemy1__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(width, height) {
  var entity = this.prefab__T__Lcom_darkoverlordofdata_entitas_Entity("enemy1");
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  var entity$1 = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).addHealth__F__F__Lcom_darkoverlordofdata_entitas_Entity(10.0, 10.0);
  var entity$2 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$1).addPosition__F__F__Lcom_darkoverlordofdata_entitas_Entity($fround((this.Random$1.nextFloat__F() * width)), $fround((height - ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).bounds__Lcom_darkoverlordofdata_demo_BoundsComponent().radius$1)));
  var entity$3 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$2).addVelocity__F__F__Lcom_darkoverlordofdata_entitas_Entity(0.0, 40.0);
  new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$3).setEnemy__Z__Lcom_darkoverlordofdata_entitas_Entity(true);
  return entity
});
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype.init___Lcom_darkoverlordofdata_entitas_Pool = (function(pool) {
  this.pool$1 = pool;
  this.Random$1 = new $c_ju_Random().init___();
  return this
});
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype.createBullet__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(x, y) {
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  var entity = this.prefab__T__Lcom_darkoverlordofdata_entitas_Entity("bullet");
  var entity$1 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity).addExpires__F__Lcom_darkoverlordofdata_entitas_Entity(0.5);
  var entity$2 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$1).addPosition__F__F__Lcom_darkoverlordofdata_entitas_Entity(x, y);
  var entity$3 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$2).addSoundEffect__I__Lcom_darkoverlordofdata_entitas_Entity($m_Lcom_darkoverlordofdata_demo_O2dLibrary$().getSoundEffect__T__I("bullet"));
  var entity$4 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$3).addTint__F__F__F__F__Lcom_darkoverlordofdata_entitas_Entity(1.0, 1.0, 0.45098039507865906, 1.0);
  var entity$5 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$4).addVelocity__F__F__Lcom_darkoverlordofdata_entitas_Entity(0.0, (-800.0));
  var entity$6 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$5).setBullet__Z__Lcom_darkoverlordofdata_entitas_Entity(true);
  return entity$6
});
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype.createPlayer__F__F__Lcom_darkoverlordofdata_entitas_Entity = (function(width, height) {
  var x = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["createPlayer ", " ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([width, height]));
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V((x + "\n"));
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  var entity = this.prefab__T__Lcom_darkoverlordofdata_entitas_Entity("player");
  var entity$1 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity).addPosition__F__F__Lcom_darkoverlordofdata_entitas_Entity($fround((width / 2.0)), 80.0);
  var entity$2 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$1).addScore__I__Lcom_darkoverlordofdata_entitas_Entity(0);
  var entity$3 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$2).setPlayer__Z__Lcom_darkoverlordofdata_entitas_Entity(true);
  var x$1 = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([entity$3]));
  var this$8 = $m_s_Console$();
  var this$9 = $as_Ljava_io_PrintStream(this$8.outVar$2.v$1);
  this$9.java$lang$JSConsoleBasedPrintStream$$printString__T__V((x$1 + "\n"));
  return entity$3
});
var $d_Lcom_darkoverlordofdata_demo_Factory$EntityFactory = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_Factory$EntityFactory: 0
}, false, "com.darkoverlordofdata.demo.Factory$EntityFactory", {
  Lcom_darkoverlordofdata_demo_Factory$EntityFactory: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_Factory$EntityFactory;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_Match$() {
  $c_O.call(this);
  this.Bounds$1 = null;
  this.Bullet$1 = null;
  this.Destroy$1 = null;
  this.Enemy$1 = null;
  this.Expires$1 = null;
  this.Firing$1 = null;
  this.Health$1 = null;
  this.Layer$1 = null;
  this.Player$1 = null;
  this.Position$1 = null;
  this.Resource$1 = null;
  this.Scale$1 = null;
  this.Score$1 = null;
  this.SoundEffect$1 = null;
  this.Tint$1 = null;
  this.Tween$1 = null;
  this.Velocity$1 = null;
  this.View$1 = null
}
$c_Lcom_darkoverlordofdata_demo_Match$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_Match$.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_Match$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_Match$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_Match$.prototype = $c_Lcom_darkoverlordofdata_demo_Match$.prototype;
$c_Lcom_darkoverlordofdata_demo_Match$.prototype.init___ = (function() {
  $n_Lcom_darkoverlordofdata_demo_Match$ = this;
  this.Bounds$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Bounds$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Bullet$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Bullet$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Destroy$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Destroy$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Enemy$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Enemy$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Expires$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Expires$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Firing$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Firing$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Health$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Health$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Layer$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Layer$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Player$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Player$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Position$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Position$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Resource$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Resource$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Scale$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Scale$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Score$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Score$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.SoundEffect$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().SoundEffect$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Tint$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Tint$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Tween$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Tween$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.Velocity$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().Velocity$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  this.View$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher($m_s_Array$().apply__I__sc_Seq__AI($m_Lcom_darkoverlordofdata_demo_Component$().View$2.i$2, new $c_sjs_js_WrappedArray().init___sjs_js_Array([])));
  return this
});
var $d_Lcom_darkoverlordofdata_demo_Match$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_Match$: 0
}, false, "com.darkoverlordofdata.demo.Match$", {
  Lcom_darkoverlordofdata_demo_Match$: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_demo_Match$.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_Match$;
var $n_Lcom_darkoverlordofdata_demo_Match$ = (void 0);
function $m_Lcom_darkoverlordofdata_demo_Match$() {
  if ((!$n_Lcom_darkoverlordofdata_demo_Match$)) {
    $n_Lcom_darkoverlordofdata_demo_Match$ = new $c_Lcom_darkoverlordofdata_demo_Match$().init___()
  };
  return $n_Lcom_darkoverlordofdata_demo_Match$
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_O2dLibrary$() {
  $c_O.call(this);
  this.PROJECT$1 = null;
  this.SCENE$1 = null;
  this.ATLAS$1 = null;
  this.sprites$1 = null;
  this.bitmap$0$1 = false
}
$c_Lcom_darkoverlordofdata_demo_O2dLibrary$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_O2dLibrary$.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_O2dLibrary$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_O2dLibrary$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_O2dLibrary$.prototype = $c_Lcom_darkoverlordofdata_demo_O2dLibrary$.prototype;
$c_Lcom_darkoverlordofdata_demo_O2dLibrary$.prototype.init___ = (function() {
  this.PROJECT$1 = "project.dt";
  this.SCENE$1 = "scenes/MainScene.dt";
  this.ATLAS$1 = "orig/pack.atlas";
  return this
});
$c_Lcom_darkoverlordofdata_demo_O2dLibrary$.prototype.getSoundEffect__T__I = (function(name) {
  return ((name === "bullet") ? $m_Lcom_darkoverlordofdata_demo_Effect$().PEW$2.i$2 : ((name === "bang") ? $m_Lcom_darkoverlordofdata_demo_Effect$().SMALLASPLODE$2.i$2 : ((name === "explosion") ? $m_Lcom_darkoverlordofdata_demo_Effect$().ASPLODE$2.i$2 : (-1))))
});
$c_Lcom_darkoverlordofdata_demo_O2dLibrary$.prototype.getSprite__T__Lcom_badlogic_gdx_graphics_g2d_Sprite = (function(name) {
  return new $g.gdx.graphics.g2d.Sprite(new $g.gdx.graphics.Texture(name))
});
$c_Lcom_darkoverlordofdata_demo_O2dLibrary$.prototype.getLayer__T__I = (function(name) {
  return ((name === "background") ? 1 : ((name === "player") ? 2 : ((name === "bullet") ? 3 : ((name === "bang") ? 4 : ((name === "explosion") ? 5 : ((name === "enemy1") ? 6 : ((name === "enemy2") ? 7 : ((name === "enemy3") ? 8 : 0))))))))
});
var $d_Lcom_darkoverlordofdata_demo_O2dLibrary$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_O2dLibrary$: 0
}, false, "com.darkoverlordofdata.demo.O2dLibrary$", {
  Lcom_darkoverlordofdata_demo_O2dLibrary$: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_demo_O2dLibrary$.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_O2dLibrary$;
var $n_Lcom_darkoverlordofdata_demo_O2dLibrary$ = (void 0);
function $m_Lcom_darkoverlordofdata_demo_O2dLibrary$() {
  if ((!$n_Lcom_darkoverlordofdata_demo_O2dLibrary$)) {
    $n_Lcom_darkoverlordofdata_demo_O2dLibrary$ = new $c_Lcom_darkoverlordofdata_demo_O2dLibrary$().init___()
  };
  return $n_Lcom_darkoverlordofdata_demo_O2dLibrary$
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$() {
  $c_O.call(this);
  this.enemyType$1 = null;
  this.Enemy1$module$1 = null;
  this.Enemy2$module$1 = null;
  this.Enemy3$module$1 = null
}
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype = $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype.Enemy3$lzycompute__p1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$ = (function() {
  if ((this.Enemy3$module$1 === null)) {
    this.Enemy3$module$1 = new $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$().init___Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$(this)
  };
  return this.Enemy3$module$1
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype.Enemy1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$ = (function() {
  return ((this.Enemy1$module$1 === null) ? this.Enemy1$lzycompute__p1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$() : this.Enemy1$module$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype.Enemy2__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$ = (function() {
  return ((this.Enemy2$module$1 === null) ? this.Enemy2$lzycompute__p1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$() : this.Enemy2$module$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype.Enemy2$lzycompute__p1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$ = (function() {
  if ((this.Enemy2$module$1 === null)) {
    this.Enemy2$module$1 = new $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$().init___Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$(this)
  };
  return this.Enemy2$module$1
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype.Enemy1$lzycompute__p1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$ = (function() {
  if ((this.Enemy1$module$1 === null)) {
    this.Enemy1$module$1 = new $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$().init___Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$(this)
  };
  return this.Enemy1$module$1
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype.Enemy3__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$ = (function() {
  return ((this.Enemy3$module$1 === null) ? this.Enemy3$lzycompute__p1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$() : this.Enemy3$module$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype.init___Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem = (function($$outer) {
  this.enemyType$1 = $as_sc_Seq($m_sc_Seq$().apply__sc_Seq__sc_GenTraversable(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.Enemy1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$(), this.Enemy2__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$(), this.Enemy3__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$()])));
  return this
});
var $d_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$: 0
}, false, "com.darkoverlordofdata.demo.systems.EntitySpawningTimerSystem$Enemies$", {
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_Entity() {
  $c_O.call(this);
  this.totalComponents$1 = 0;
  this.onEntityReleased$1 = null;
  this.onComponentAdded$1 = null;
  this.onComponentRemoved$1 = null;
  this.onComponentReplaced$1 = null;
  this.$$undname$1 = null;
  this.$$undrefCount$1 = 0;
  this.$$undisEnabled$1 = false;
  this.$$undcreationIndex$1 = 0;
  this.toStringCache$1 = null;
  this.com$darkoverlordofdata$entitas$Entity$$components$1 = null;
  this.componentsCache$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_Entity;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_Entity() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_Entity.prototype = $c_Lcom_darkoverlordofdata_entitas_Entity.prototype;
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.hasComponents__AI__Z = (function(indices) {
  var nonLocalReturnKey1 = new $c_O().init___();
  try {
    var i = 0;
    var len = indices.u.length;
    while ((i < len)) {
      var idx = i;
      var arg1 = indices.u[idx];
      if ((this.com$darkoverlordofdata$entitas$Entity$$components$1.u[arg1] === null)) {
        throw new $c_sr_NonLocalReturnControl$mcZ$sp().init___O__Z(nonLocalReturnKey1, false)
      };
      i = ((1 + i) | 0)
    };
    return true
  } catch (e) {
    if ($is_sr_NonLocalReturnControl(e)) {
      var ex = $as_sr_NonLocalReturnControl(e);
      if ((ex.key$2 === nonLocalReturnKey1)) {
        return ex.value$mcZ$sp$f
      } else {
        throw ex
      }
    } else {
      throw e
    }
  }
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.destroy__V = (function() {
  this.removeAllComponents__V();
  var this$1 = this.onComponentAdded$1;
  this$1.invokers$1.clear__V();
  var this$2 = this.onComponentRemoved$1;
  this$2.invokers$1.clear__V();
  var this$3 = this.onComponentReplaced$1;
  this$3.invokers$1.clear__V();
  this.componentsCache$1 = $m_sci_Nil$();
  this.$$undname$1 = "";
  this.$$undisEnabled$1 = false
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.getComponent__I__Lcom_darkoverlordofdata_entitas_IComponent = (function(index) {
  if ((!this.hasComponent__I__Z(index))) {
    var errorMsg = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Cannot get component at index ", " from ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([index, this.toString__T()]));
    throw new $c_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException().init___T__I(errorMsg, index)
  };
  return this.com$darkoverlordofdata$entitas$Entity$$components$1.u[index]
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.removeComponent__I__Lcom_darkoverlordofdata_entitas_Entity = (function(index) {
  if ((!this.$$undisEnabled$1)) {
    throw new $c_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException().init___T("Entity is disabled, cannot remove component")
  };
  if ((!this.hasComponent__I__Z(index))) {
    var errorMsg = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Cannot remove component at index ", " from ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([index, this.toString__T()]));
    throw new $c_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException().init___T__I(errorMsg, index)
  };
  this.$$undreplaceComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity(index, null);
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.release__V = (function() {
  this.$$undrefCount$1 = (((-1) + this.$$undrefCount$1) | 0);
  if ((this.$$undrefCount$1 === 0)) {
    this.onEntityReleased$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs().init___Lcom_darkoverlordofdata_entitas_Entity(this))
  } else if ((this.$$undrefCount$1 < 0)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(new $c_jl_Exception().init___T(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Entity is already released ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.toString__T()]))))
  }
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.toString__T = (function() {
  if ((this.toStringCache$1 === "")) {
    var sb = new $c_scm_StringBuilder().init___();
    sb.append__T__scm_StringBuilder("Entity_");
    if ((this.$$undname$1 !== "")) {
      var jsx$1 = this.$$undname$1
    } else {
      var this$1 = this.$$undcreationIndex$1;
      var jsx$1 = ("" + this$1)
    };
    sb.append__T__scm_StringBuilder(jsx$1);
    sb.append__T__scm_StringBuilder(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["(", ")("])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.$$undcreationIndex$1])));
    var xs = this.com$darkoverlordofdata$entitas$Entity$$components$1;
    var end = xs.u.length;
    var isEmpty$4 = (end <= 0);
    var lastElement$4 = (isEmpty$4 ? (-1) : (((-1) + end) | 0));
    if ((!isEmpty$4)) {
      var i = 0;
      while (true) {
        var arg1 = i;
        if ((this.com$darkoverlordofdata$entitas$Entity$$components$1.u[arg1] !== null)) {
          var this$8 = this.com$darkoverlordofdata$entitas$Entity$$components$1.u[arg1];
          sb.append__T__scm_StringBuilder($objectGetClass(this$8).getName__T());
          sb.append__T__scm_StringBuilder(",")
        };
        if ((i === lastElement$4)) {
          break
        };
        i = ((1 + i) | 0)
      }
    };
    sb.append__T__scm_StringBuilder(")");
    var this$9 = sb.underlying$5;
    var thiz = this$9.content$1;
    this.toStringCache$1 = $as_T(thiz.split(",)").join(")"))
  };
  return this.toStringCache$1
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.updateComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity = (function(index, component) {
  var previousComponent = this.com$darkoverlordofdata$entitas$Entity$$components$1.u[index];
  if ((previousComponent !== null)) {
    this.com$darkoverlordofdata$entitas$Entity$$components$1.u[index] = component
  };
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.init___I = (function(totalComponents) {
  this.totalComponents$1 = totalComponents;
  this.onEntityReleased$1 = new $c_Lcom_darkoverlordofdata_entitas_Event().init___();
  this.onComponentAdded$1 = new $c_Lcom_darkoverlordofdata_entitas_Event().init___();
  this.onComponentRemoved$1 = new $c_Lcom_darkoverlordofdata_entitas_Event().init___();
  this.onComponentReplaced$1 = new $c_Lcom_darkoverlordofdata_entitas_Event().init___();
  this.$$undname$1 = "";
  this.$$undrefCount$1 = 0;
  this.$$undisEnabled$1 = false;
  this.$$undcreationIndex$1 = 0;
  this.toStringCache$1 = "";
  this.com$darkoverlordofdata$entitas$Entity$$components$1 = $newArrayObject($d_Lcom_darkoverlordofdata_entitas_IComponent.getArrayOf(), [totalComponents]);
  this.componentsCache$1 = $m_sci_Nil$();
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.removeAllComponents__V = (function() {
  var end = this.totalComponents$1;
  var isEmpty$4 = (end <= 0);
  var lastElement$4 = (isEmpty$4 ? (-1) : (((-1) + end) | 0));
  if ((!isEmpty$4)) {
    var i = 0;
    while (true) {
      var arg1 = i;
      if ((this.com$darkoverlordofdata$entitas$Entity$$components$1.u[arg1] !== null)) {
        this.$$undreplaceComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity(arg1, null)
      };
      if ((i === lastElement$4)) {
        break
      };
      i = ((1 + i) | 0)
    }
  }
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.$$undreplaceComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity = (function(index, component) {
  var previousComponent = this.com$darkoverlordofdata$entitas$Entity$$components$1.u[index];
  if ((previousComponent !== null)) {
    if (previousComponent.equals__O__Z(component)) {
      this.onComponentReplaced$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs().init___Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_IComponent(this, index, previousComponent, component))
    } else {
      this.com$darkoverlordofdata$entitas$Entity$$components$1.u[index] = component;
      this.componentsCache$1 = $m_sci_Nil$();
      this.toStringCache$1 = "";
      if ((component === null)) {
        this.onComponentRemoved$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_EntityChangedArgs().init___Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent(this, index, previousComponent))
      } else {
        this.onComponentReplaced$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs().init___Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_IComponent(this, index, previousComponent, component))
      }
    }
  };
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.retain__Lcom_darkoverlordofdata_entitas_Entity = (function() {
  this.$$undrefCount$1 = ((1 + this.$$undrefCount$1) | 0);
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.hasAnyComponent__AI__Z = (function(indices) {
  var nonLocalReturnKey2 = new $c_O().init___();
  try {
    var i = 0;
    var len = indices.u.length;
    while ((i < len)) {
      var idx = i;
      var arg1 = indices.u[idx];
      if ((this.com$darkoverlordofdata$entitas$Entity$$components$1.u[arg1] !== null)) {
        throw new $c_sr_NonLocalReturnControl$mcZ$sp().init___O__Z(nonLocalReturnKey2, true)
      };
      i = ((1 + i) | 0)
    };
    return false
  } catch (e) {
    if ($is_sr_NonLocalReturnControl(e)) {
      var ex = $as_sr_NonLocalReturnControl(e);
      if ((ex.key$2 === nonLocalReturnKey2)) {
        return ex.value$mcZ$sp$f
      } else {
        throw ex
      }
    } else {
      throw e
    }
  }
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.hasComponent__I__Z = (function(index) {
  return (this.com$darkoverlordofdata$entitas$Entity$$components$1.u[index] !== null)
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.initialize__T__I__V = (function(name, creationIndex) {
  this.$$undname$1 = name;
  this.$$undcreationIndex$1 = creationIndex;
  this.$$undisEnabled$1 = true
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.addComponent__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_Entity = (function(index, component) {
  if ((!this.$$undisEnabled$1)) {
    throw new $c_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException().init___T("Cannot add component!")
  };
  if (this.hasComponent__I__Z(index)) {
    var errorMsg = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Cannot add component at index ", " to ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([index, this.toString__T()]));
    throw new $c_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException().init___T__I(errorMsg, index)
  };
  this.com$darkoverlordofdata$entitas$Entity$$components$1.u[index] = component;
  this.componentsCache$1 = $m_sci_Nil$();
  this.toStringCache$1 = "";
  this.onComponentAdded$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_EntityChangedArgs().init___Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent(this, index, component));
  return this
});
function $is_Lcom_darkoverlordofdata_entitas_Entity(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_Entity)))
}
function $as_Lcom_darkoverlordofdata_entitas_Entity(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_Entity(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.Entity"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_Entity(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_Entity)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_Entity(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_Entity(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.Entity;", depth))
}
var $d_Lcom_darkoverlordofdata_entitas_Entity = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_Entity: 0
}, false, "com.darkoverlordofdata.entitas.Entity", {
  Lcom_darkoverlordofdata_entitas_Entity: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_entitas_Entity.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_Entity;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_Event() {
  $c_O.call(this);
  this.invokers$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_Event.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_Event.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_Event;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_Event() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_Event.prototype = $c_Lcom_darkoverlordofdata_entitas_Event.prototype;
$c_Lcom_darkoverlordofdata_entitas_Event.prototype.init___ = (function() {
  this.invokers$1 = new $c_scm_ListBuffer().init___();
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Event.prototype.apply__O__V = (function(args) {
  var this$1 = this.invokers$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  var these = this$2;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    var x$1 = $as_F1(arg1);
    x$1.apply__O__O(args);
    these = $as_sci_List(these.tail__O())
  }
});
var $d_Lcom_darkoverlordofdata_entitas_Event = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_Event: 0
}, false, "com.darkoverlordofdata.entitas.Event", {
  Lcom_darkoverlordofdata_entitas_Event: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_entitas_Event.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_Event;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_Group() {
  $c_O.call(this);
  this.matcher$1 = null;
  this.onEntityAdded$1 = null;
  this.onEntityRemoved$1 = null;
  this.onEntityUpdated$1 = null;
  this.$$undentities$1 = null;
  this.$$undtoStringCache$1 = null;
  this.$$undentitiesCache$1 = null;
  this.$$undsingleEntityCache$1 = null;
  this.count$1 = 0
}
$c_Lcom_darkoverlordofdata_entitas_Group.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_Group;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_Group() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_Group.prototype = $c_Lcom_darkoverlordofdata_entitas_Group.prototype;
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.init___Lcom_darkoverlordofdata_entitas_IMatcher = (function(matcher) {
  this.matcher$1 = matcher;
  this.onEntityAdded$1 = new $c_Lcom_darkoverlordofdata_entitas_Event().init___();
  this.onEntityRemoved$1 = new $c_Lcom_darkoverlordofdata_entitas_Event().init___();
  this.onEntityUpdated$1 = new $c_Lcom_darkoverlordofdata_entitas_Event().init___();
  this.$$undentities$1 = new $c_scm_HashSet().init___();
  this.$$undtoStringCache$1 = "";
  this.$$undentitiesCache$1 = $m_sci_Nil$();
  this.$$undsingleEntityCache$1 = null;
  var this$1 = this.$$undentities$1;
  this.count$1 = this$1.tableSize$5;
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.toString__T = (function() {
  if ((this.$$undtoStringCache$1 === "")) {
    this.$$undtoStringCache$1 = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Group(", ")"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.matcher$1.toString__T()]))
  };
  return this.$$undtoStringCache$1
});
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.removeEntitySilently__Lcom_darkoverlordofdata_entitas_Entity__V = (function(entity) {
  var this$1 = this.$$undentities$1;
  if ($s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this$1, entity)) {
    var this$2 = this.$$undentities$1;
    $s_scm_FlatHashTable$class__removeElem__scm_FlatHashTable__O__Z(this$2, entity);
    this.$$undentitiesCache$1 = $m_sci_Nil$();
    this.$$undsingleEntityCache$1 = null;
    entity.release__V()
  }
});
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.removeEntity__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__V = (function(entity, index, component) {
  var this$1 = this.$$undentities$1;
  if ($s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this$1, entity)) {
    var this$2 = this.$$undentities$1;
    $s_scm_FlatHashTable$class__removeElem__scm_FlatHashTable__O__Z(this$2, entity);
    this.$$undentitiesCache$1 = $m_sci_Nil$();
    this.$$undsingleEntityCache$1 = null;
    this.onEntityRemoved$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_GroupChangedArgs().init___Lcom_darkoverlordofdata_entitas_Group__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent(this, entity, index, component));
    entity.release__V()
  }
});
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.addEntity__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__V = (function(entity, index, component) {
  var this$1 = this.$$undentities$1;
  if ((!$s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this$1, entity))) {
    var this$2 = this.$$undentities$1;
    $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z(this$2, entity);
    this.$$undentitiesCache$1 = $m_sci_Nil$();
    this.$$undtoStringCache$1 = "";
    entity.retain__Lcom_darkoverlordofdata_entitas_Entity();
    this.onEntityAdded$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_GroupChangedArgs().init___Lcom_darkoverlordofdata_entitas_Group__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent(this, entity, index, component))
  }
});
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.handleEntity__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__V = (function(entity, index, component) {
  if (this.matcher$1.matches__Lcom_darkoverlordofdata_entitas_Entity__Z(entity)) {
    this.addEntity__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__V(entity, index, component)
  } else {
    this.removeEntity__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__V(entity, index, component)
  }
});
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.updateEntity__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_IComponent__V = (function(entity, index, previousComponent, newComponent) {
  var this$1 = this.$$undentities$1;
  if ($s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this$1, entity)) {
    this.onEntityRemoved$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_GroupChangedArgs().init___Lcom_darkoverlordofdata_entitas_Group__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent(this, entity, index, previousComponent));
    this.onEntityAdded$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_GroupChangedArgs().init___Lcom_darkoverlordofdata_entitas_Group__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent(this, entity, index, newComponent));
    this.onEntityUpdated$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs().init___Lcom_darkoverlordofdata_entitas_Group__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_IComponent(this, entity, index, previousComponent, newComponent))
  }
});
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.singleEntity__Lcom_darkoverlordofdata_entitas_Entity = (function() {
  var this$1 = this.entities__sci_List();
  var x1 = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this$1);
  switch (x1) {
    case 1: {
      return $as_Lcom_darkoverlordofdata_entitas_Entity(this.entities__sci_List().head__O());
      break
    }
    case 0: {
      return null;
      break
    }
    default: {
      throw new $c_Lcom_darkoverlordofdata_entitas_SingleEntityException().init___Lcom_darkoverlordofdata_entitas_IMatcher(this.matcher$1)
    }
  }
});
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.handleEntitySilently__Lcom_darkoverlordofdata_entitas_Entity__O = (function(entity) {
  return (this.matcher$1.matches__Lcom_darkoverlordofdata_entitas_Entity__Z(entity) ? this.addEntitySilently__Lcom_darkoverlordofdata_entitas_Entity__O(entity) : (this.removeEntitySilently__Lcom_darkoverlordofdata_entitas_Entity__V(entity), (void 0)))
});
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.entities__sci_List = (function() {
  if (this.$$undentitiesCache$1.isEmpty__Z()) {
    var this$1 = this.$$undentities$1;
    var this$2 = $m_sci_List$();
    var cbf = this$2.ReusableCBFInstance$2;
    this.$$undentitiesCache$1 = $as_sci_List($s_sc_TraversableLike$class__to__sc_TraversableLike__scg_CanBuildFrom__O(this$1, cbf))
  };
  return this.$$undentitiesCache$1
});
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.addEntitySilently__Lcom_darkoverlordofdata_entitas_Entity__O = (function(entity) {
  var this$1 = this.$$undentities$1;
  if ((!$s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this$1, entity))) {
    var this$2 = this.$$undentities$1;
    $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z(this$2, entity);
    this.$$undentitiesCache$1 = $m_sci_Nil$();
    this.$$undtoStringCache$1 = "";
    return entity.retain__Lcom_darkoverlordofdata_entitas_Entity()
  } else {
    return (void 0)
  }
});
function $is_Lcom_darkoverlordofdata_entitas_Group(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_Group)))
}
function $as_Lcom_darkoverlordofdata_entitas_Group(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_Group(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.Group"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_Group(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_Group)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_Group(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_Group(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.Group;", depth))
}
var $d_Lcom_darkoverlordofdata_entitas_Group = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_Group: 0
}, false, "com.darkoverlordofdata.entitas.Group", {
  Lcom_darkoverlordofdata_entitas_Group: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_entitas_Group.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_Group;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_GroupObserver() {
  $c_O.call(this);
  this.com$darkoverlordofdata$entitas$GroupObserver$$groups$f = null;
  this.com$darkoverlordofdata$entitas$GroupObserver$$eventTypes$f = null;
  this.com$darkoverlordofdata$entitas$GroupObserver$$$undcollectedEntities$1 = null;
  this.addEntity$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_GroupObserver.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_GroupObserver.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_GroupObserver;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_GroupObserver() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_GroupObserver.prototype = $c_Lcom_darkoverlordofdata_entitas_GroupObserver.prototype;
$c_Lcom_darkoverlordofdata_entitas_GroupObserver.prototype.init___ALcom_darkoverlordofdata_entitas_Group__ALcom_darkoverlordofdata_entitas_GroupEventType$EnumVal = (function(groups, eventTypes) {
  this.com$darkoverlordofdata$entitas$GroupObserver$$groups$f = groups;
  this.com$darkoverlordofdata$entitas$GroupObserver$$eventTypes$f = eventTypes;
  this.com$darkoverlordofdata$entitas$GroupObserver$$$undcollectedEntities$1 = new $c_scm_HashSet().init___();
  if ((groups.u.length !== eventTypes.u.length)) {
    throw new $c_Lcom_darkoverlordofdata_entitas_GroupObserverException().init___T(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Unbalanced count with groups (", ") and event types (", ")"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([groups.u.length, eventTypes.u.length])))
  };
  this.activate__V();
  this.addEntity$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function(e$2) {
      var e = $as_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(e$2);
      var this$1 = arg$outer.com$darkoverlordofdata$entitas$GroupObserver$$$undcollectedEntities$1;
      var elem = e.entity$1;
      if ($s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this$1, elem)) {
        var this$2 = arg$outer.com$darkoverlordofdata$entitas$GroupObserver$$$undcollectedEntities$1;
        var elem$1 = e.entity$1;
        $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z(this$2, elem$1);
        e.entity$1.retain__Lcom_darkoverlordofdata_entitas_Entity()
      }
    })
  })(this));
  return this
});
$c_Lcom_darkoverlordofdata_entitas_GroupObserver.prototype.activate__V = (function() {
  var xs = this.com$darkoverlordofdata$entitas$GroupObserver$$groups$f;
  var end = xs.u.length;
  var isEmpty$4 = (end <= 0);
  var lastElement$4 = (isEmpty$4 ? (-1) : (((-1) + end) | 0));
  if ((!isEmpty$4)) {
    var i = 0;
    while (true) {
      var v1 = i;
      var group = this.com$darkoverlordofdata$entitas$GroupObserver$$groups$f.u[v1];
      var eventType = this.com$darkoverlordofdata$entitas$GroupObserver$$eventTypes$f.u[v1];
      var x = $m_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$();
      if ((x === eventType)) {
        var this$6 = group.onEntityAdded$1;
        var invoker = this.addEntity$1;
        this$6.invokers$1.$$minus$eq__O__scm_ListBuffer(invoker);
        var this$7 = group.onEntityAdded$1;
        var invoker$1 = this.addEntity$1;
        this$7.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker$1)
      } else {
        var x$3 = $m_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$();
        if ((x$3 === eventType)) {
          var this$8 = group.onEntityRemoved$1;
          var invoker$2 = this.addEntity$1;
          this$8.invokers$1.$$minus$eq__O__scm_ListBuffer(invoker$2);
          var this$9 = group.onEntityRemoved$1;
          var invoker$3 = this.addEntity$1;
          this$9.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker$3)
        } else {
          var x$5 = $m_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$();
          if ((x$5 === eventType)) {
            var this$10 = group.onEntityAdded$1;
            var invoker$4 = this.addEntity$1;
            this$10.invokers$1.$$minus$eq__O__scm_ListBuffer(invoker$4);
            var this$11 = group.onEntityAdded$1;
            var invoker$5 = this.addEntity$1;
            this$11.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker$5);
            var this$12 = group.onEntityRemoved$1;
            var invoker$6 = this.addEntity$1;
            this$12.invokers$1.$$minus$eq__O__scm_ListBuffer(invoker$6);
            var this$13 = group.onEntityRemoved$1;
            var invoker$7 = this.addEntity$1;
            this$13.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker$7)
          } else {
            throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(new $c_jl_Exception().init___T(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Invalid eventType ", " in GroupObserver::activate"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([eventType]))))
          }
        }
      };
      if ((i === lastElement$4)) {
        break
      };
      i = ((1 + i) | 0)
    }
  }
});
$c_Lcom_darkoverlordofdata_entitas_GroupObserver.prototype.clearCollectedEntities__V = (function() {
  var this$1 = this.com$darkoverlordofdata$entitas$GroupObserver$$$undcollectedEntities$1;
  var p = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(check$ifrefutable$1$2) {
    var check$ifrefutable$1 = $as_Lcom_darkoverlordofdata_entitas_Entity(check$ifrefutable$1$2);
    return (check$ifrefutable$1 !== null)
  }));
  new $c_sc_TraversableLike$WithFilter().init___sc_TraversableLike__F1(this$1, p).foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(entity$2) {
    var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(entity$2);
    entity.release__V()
  })));
  this.com$darkoverlordofdata$entitas$GroupObserver$$$undcollectedEntities$1 = new $c_scm_HashSet().init___()
});
var $d_Lcom_darkoverlordofdata_entitas_GroupObserver = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_GroupObserver: 0
}, false, "com.darkoverlordofdata.entitas.GroupObserver", {
  Lcom_darkoverlordofdata_entitas_GroupObserver: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_entitas_GroupObserver.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_GroupObserver;
function $is_Lcom_darkoverlordofdata_entitas_IExecuteSystem(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_IExecuteSystem)))
}
function $as_Lcom_darkoverlordofdata_entitas_IExecuteSystem(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_IExecuteSystem(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.IExecuteSystem"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_IExecuteSystem(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_IExecuteSystem)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_IExecuteSystem(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_IExecuteSystem(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.IExecuteSystem;", depth))
}
function $is_Lcom_darkoverlordofdata_entitas_IInitializeSystem(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_IInitializeSystem)))
}
function $as_Lcom_darkoverlordofdata_entitas_IInitializeSystem(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_IInitializeSystem(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.IInitializeSystem"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_IInitializeSystem(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_IInitializeSystem)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_IInitializeSystem(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_IInitializeSystem(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.IInitializeSystem;", depth))
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_Matcher$() {
  $c_O.call(this);
  this.$$unduniqueId$1 = 0
}
$c_Lcom_darkoverlordofdata_entitas_Matcher$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_Matcher$.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_Matcher$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_Matcher$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_Matcher$.prototype = $c_Lcom_darkoverlordofdata_entitas_Matcher$.prototype;
$c_Lcom_darkoverlordofdata_entitas_Matcher$.prototype.init___ = (function() {
  this.$$unduniqueId$1 = 0;
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Matcher$.prototype.uniqueId__I = (function() {
  this.$$unduniqueId$1 = ((1 + this.$$unduniqueId$1) | 0);
  return this.$$unduniqueId$1
});
$c_Lcom_darkoverlordofdata_entitas_Matcher$.prototype.mergeIndices__ALcom_darkoverlordofdata_entitas_IMatcher__AI = (function(matchers) {
  var indices = new $c_scm_ListBuffer().init___();
  var i = 0;
  var len = matchers.u.length;
  while ((i < len)) {
    var index = i;
    var arg1 = matchers.u[index];
    var matcher = $as_Lcom_darkoverlordofdata_entitas_IMatcher(arg1);
    if ((matcher.indices__AI().u.length !== 1)) {
      throw new $c_Lcom_darkoverlordofdata_entitas_MatcherException().init___Lcom_darkoverlordofdata_entitas_IMatcher(matcher)
    };
    indices.$$plus$eq__O__scm_ListBuffer(matcher.indices__AI().u[0]);
    i = ((1 + i) | 0)
  };
  var this$6 = indices.scala$collection$mutable$ListBuffer$$start$6;
  var len$1 = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this$6);
  var result = $newArrayObject($d_I.getArrayOf(), [len$1]);
  $s_sc_TraversableOnce$class__copyToArray__sc_TraversableOnce__O__I__V(this$6, result, 0);
  return result
});
$c_Lcom_darkoverlordofdata_entitas_Matcher$.prototype.distinctIndices__AI__AI = (function(indices) {
  var indicesSet = new $c_scm_HashSet().init___();
  var i = 0;
  var len = indices.u.length;
  while ((i < len)) {
    var idx = i;
    var arg1 = indices.u[idx];
    $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z(indicesSet, arg1);
    i = ((1 + i) | 0)
  };
  var len$1 = indicesSet.tableSize$5;
  var result = $newArrayObject($d_I.getArrayOf(), [len$1]);
  $s_sc_TraversableOnce$class__copyToArray__sc_TraversableOnce__O__I__V(indicesSet, result, 0);
  return result
});
$c_Lcom_darkoverlordofdata_entitas_Matcher$.prototype.allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher = (function(args) {
  var matcher = new $c_Lcom_darkoverlordofdata_entitas_Matcher().init___();
  var schematic = $objectGetClass(args);
  if ((schematic.getComponentType__jl_Class() === $d_I.getClassOf())) {
    var jsx$1 = args
  } else {
    var len = args.u.length;
    var result = $newArrayObject($d_I.getArrayOf(), [len]);
    var len$1 = result.u.length;
    var y = args.u.length;
    var l = ((len$1 < y) ? len$1 : y);
    if ((result.u.length < l)) {
      var x = result.u.length;
      l = ((x > 0) ? x : 0)
    };
    $m_s_Array$().copy__O__I__O__I__I__V(args, 0, result, 0, l);
    var jsx$1 = result
  };
  matcher.allOfIndices$1 = this.distinctIndices__AI__AI(jsx$1);
  return matcher
});
var $d_Lcom_darkoverlordofdata_entitas_Matcher$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_Matcher$: 0
}, false, "com.darkoverlordofdata.entitas.Matcher$", {
  Lcom_darkoverlordofdata_entitas_Matcher$: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_entitas_Matcher$.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_Matcher$;
var $n_Lcom_darkoverlordofdata_entitas_Matcher$ = (void 0);
function $m_Lcom_darkoverlordofdata_entitas_Matcher$() {
  if ((!$n_Lcom_darkoverlordofdata_entitas_Matcher$)) {
    $n_Lcom_darkoverlordofdata_entitas_Matcher$ = new $c_Lcom_darkoverlordofdata_entitas_Matcher$().init___()
  };
  return $n_Lcom_darkoverlordofdata_entitas_Matcher$
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_Pool() {
  $c_O.call(this);
  this.totalComponents$1 = 0;
  this.startCreationIndex$1 = 0;
  this.onEntityCreated$1 = null;
  this.onEntityWillBeDestroyed$1 = null;
  this.onEntityDestroyed$1 = null;
  this.onGroupCreated$1 = null;
  this.$$undcreationIndex$1 = 0;
  this.$$undentities$1 = null;
  this.$$undgroups$1 = null;
  this.com$darkoverlordofdata$entitas$Pool$$$undgroupsForIndex$1 = null;
  this.com$darkoverlordofdata$entitas$Pool$$$undreusableEntities$1 = null;
  this.com$darkoverlordofdata$entitas$Pool$$$undretainedEntities$1 = null;
  this.com$darkoverlordofdata$entitas$Pool$$$undentitiesCache$1 = null;
  this.com$darkoverlordofdata$entitas$Pool$$onEntityReleasedCache$1 = null;
  this.onEntityReleased$1 = null;
  this.updateGroupsComponentAddedOrRemoved$1 = null;
  this.updateGroupsComponentReplaced$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_Pool.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_Pool.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_Pool;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_Pool() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_Pool.prototype = $c_Lcom_darkoverlordofdata_entitas_Pool.prototype;
$c_Lcom_darkoverlordofdata_entitas_Pool.prototype.destroyEntity__Lcom_darkoverlordofdata_entitas_Entity__O = (function(entity) {
  if ((entity !== null)) {
    var this$1 = this.$$undentities$1;
    if ((!$s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this$1, entity))) {
      throw new $c_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException().init___Lcom_darkoverlordofdata_entitas_Entity__T(entity, "Could not destroy entity!")
    };
    var this$2 = this.$$undentities$1;
    $s_scm_FlatHashTable$class__removeElem__scm_FlatHashTable__O__Z(this$2, entity);
    var this$3 = this.com$darkoverlordofdata$entitas$Pool$$$undentitiesCache$1;
    $s_scm_ResizableArray$class__reduceToSize__scm_ResizableArray__I__V(this$3, 0);
    this.onEntityWillBeDestroyed$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs().init___Lcom_darkoverlordofdata_entitas_Pool__Lcom_darkoverlordofdata_entitas_Entity(this, entity));
    entity.destroy__V();
    this.onEntityDestroyed$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs().init___Lcom_darkoverlordofdata_entitas_Pool__Lcom_darkoverlordofdata_entitas_Entity(this, entity));
    if ((entity.$$undrefCount$1 === 1)) {
      var this$4 = entity.onEntityReleased$1;
      var invoker = this.onEntityReleased$1;
      this$4.invokers$1.$$minus$eq__O__scm_ListBuffer(invoker);
      return this.com$darkoverlordofdata$entitas$Pool$$$undreusableEntities$1.$$plus$eq__O__scm_ListBuffer(entity)
    } else {
      var this$5 = this.com$darkoverlordofdata$entitas$Pool$$$undretainedEntities$1;
      return $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z(this$5, entity)
    }
  } else {
    return (void 0)
  }
});
$c_Lcom_darkoverlordofdata_entitas_Pool.prototype.init___I__I = (function(totalComponents, startCreationIndex) {
  this.totalComponents$1 = totalComponents;
  this.startCreationIndex$1 = startCreationIndex;
  this.onEntityCreated$1 = new $c_Lcom_darkoverlordofdata_entitas_Event().init___();
  this.onEntityWillBeDestroyed$1 = new $c_Lcom_darkoverlordofdata_entitas_Event().init___();
  this.onEntityDestroyed$1 = new $c_Lcom_darkoverlordofdata_entitas_Event().init___();
  this.onGroupCreated$1 = new $c_Lcom_darkoverlordofdata_entitas_Event().init___();
  this.$$undcreationIndex$1 = startCreationIndex;
  this.$$undentities$1 = new $c_scm_HashSet().init___();
  this.$$undgroups$1 = new $c_scm_HashMap().init___();
  this.com$darkoverlordofdata$entitas$Pool$$$undgroupsForIndex$1 = new $c_scm_HashMap().init___();
  this.com$darkoverlordofdata$entitas$Pool$$$undreusableEntities$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$entitas$Pool$$$undretainedEntities$1 = new $c_scm_HashSet().init___();
  this.com$darkoverlordofdata$entitas$Pool$$$undentitiesCache$1 = new $c_scm_ArrayBuffer().init___();
  this.com$darkoverlordofdata$entitas$Pool$$onEntityReleasedCache$1 = null;
  this.onEntityReleased$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function(e$2) {
      var e = $as_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs(e$2);
      var this$1 = e.entity$1;
      if (this$1.$$undisEnabled$1) {
        throw new $c_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException().init___T("Cannot release entity.")
      };
      var this$2 = e.entity$1.onEntityReleased$1;
      var invoker = arg$outer.com$darkoverlordofdata$entitas$Pool$$onEntityReleasedCache$1;
      this$2.invokers$1.$$minus$eq__O__scm_ListBuffer(invoker);
      var this$3 = arg$outer.com$darkoverlordofdata$entitas$Pool$$$undretainedEntities$1;
      var elem = e.entity$1;
      $s_scm_FlatHashTable$class__removeElem__scm_FlatHashTable__O__Z(this$3, elem);
      arg$outer.com$darkoverlordofdata$entitas$Pool$$$undreusableEntities$1.$$plus$eq__O__scm_ListBuffer(e.entity$1)
    })
  })(this));
  this.updateGroupsComponentAddedOrRemoved$1 = new $c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2().init___Lcom_darkoverlordofdata_entitas_Pool(this);
  this.updateGroupsComponentReplaced$1 = new $c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3().init___Lcom_darkoverlordofdata_entitas_Pool(this);
  this.com$darkoverlordofdata$entitas$Pool$$onEntityReleasedCache$1 = this.onEntityReleased$1;
  $m_Lcom_darkoverlordofdata_entitas_Pool$().com$darkoverlordofdata$entitas$Pool$$$undinstance$1 = this;
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Pool.prototype.createEntity__T__Lcom_darkoverlordofdata_entitas_Entity = (function(name) {
  var this$1 = this.com$darkoverlordofdata$entitas$Pool$$$undreusableEntities$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var jsx$1 = this.com$darkoverlordofdata$entitas$Pool$$$undreusableEntities$1;
    var this$3 = this.com$darkoverlordofdata$entitas$Pool$$$undreusableEntities$1;
    var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(jsx$1.remove__I__O((((-1) + this$3.len$6) | 0)))
  } else {
    var entity = new $c_Lcom_darkoverlordofdata_entitas_Entity().init___I(this.totalComponents$1)
  };
  this.$$undcreationIndex$1 = ((1 + this.$$undcreationIndex$1) | 0);
  entity.initialize__T__I__V(name, this.$$undcreationIndex$1);
  entity.retain__Lcom_darkoverlordofdata_entitas_Entity();
  var this$4 = entity.onComponentAdded$1;
  var invoker = this.updateGroupsComponentAddedOrRemoved$1;
  this$4.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker);
  var this$5 = entity.onComponentRemoved$1;
  var invoker$1 = this.updateGroupsComponentAddedOrRemoved$1;
  this$5.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker$1);
  var this$6 = entity.onComponentReplaced$1;
  var invoker$2 = this.updateGroupsComponentReplaced$1;
  this$6.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker$2);
  var this$7 = entity.onEntityReleased$1;
  var invoker$3 = this.onEntityReleased$1;
  this$7.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker$3);
  var this$8 = this.$$undentities$1;
  $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z(this$8, entity);
  var this$9 = this.com$darkoverlordofdata$entitas$Pool$$$undentitiesCache$1;
  $s_scm_ResizableArray$class__reduceToSize__scm_ResizableArray__I__V(this$9, 0);
  this.onEntityCreated$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs().init___Lcom_darkoverlordofdata_entitas_Pool__Lcom_darkoverlordofdata_entitas_Entity(this, entity));
  return entity
});
$c_Lcom_darkoverlordofdata_entitas_Pool.prototype.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem = (function(system) {
  $m_Lcom_darkoverlordofdata_entitas_Pool$().setPool__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Pool__V(system, this);
  if ($is_Lcom_darkoverlordofdata_entitas_IReactiveSystem(system)) {
    var x2 = $as_Lcom_darkoverlordofdata_entitas_IReactiveSystem(system);
    return new $c_Lcom_darkoverlordofdata_entitas_ReactiveSystem().init___Lcom_darkoverlordofdata_entitas_Pool__Lcom_darkoverlordofdata_entitas_IReactiveExecuteSystem(this, x2)
  } else if ($is_Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem(system)) {
    var x3 = $as_Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem(system);
    return new $c_Lcom_darkoverlordofdata_entitas_ReactiveSystem().init___Lcom_darkoverlordofdata_entitas_Pool__Lcom_darkoverlordofdata_entitas_IReactiveExecuteSystem(this, x3)
  } else {
    return system
  }
});
$c_Lcom_darkoverlordofdata_entitas_Pool.prototype.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group = (function(matcher) {
  if (this.$$undgroups$1.contains__O__Z(matcher.$$undid$1)) {
    var group = $as_Lcom_darkoverlordofdata_entitas_Group(this.$$undgroups$1.apply__O__O(matcher.$$undid$1));
    return group
  } else {
    var group$2 = new $c_Lcom_darkoverlordofdata_entitas_Group().init___Lcom_darkoverlordofdata_entitas_IMatcher(matcher);
    var this$1 = this.getEntities__scm_ArrayBuffer();
    var i = 0;
    var top = this$1.size0$6;
    while ((i < top)) {
      var arg1 = this$1.array$6.u[i];
      var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1);
      group$2.handleEntitySilently__Lcom_darkoverlordofdata_entitas_Entity__O(entity);
      i = ((1 + i) | 0)
    };
    var this$2 = this.$$undgroups$1;
    var key = matcher.$$undid$1;
    this$2.put__O__O__s_Option(key, group$2);
    var xs = matcher.indices__AI();
    var i$1 = 0;
    var len = xs.u.length;
    while ((i$1 < len)) {
      var idx = i$1;
      var arg1$1 = xs.u[idx];
      if ((!this.com$darkoverlordofdata$entitas$Pool$$$undgroupsForIndex$1.contains__O__Z(arg1$1))) {
        var this$6 = this.com$darkoverlordofdata$entitas$Pool$$$undgroupsForIndex$1;
        var value = new $c_scm_ArrayBuffer().init___();
        this$6.put__O__O__s_Option(arg1$1, value)
      };
      $as_scm_ArrayBuffer(this.com$darkoverlordofdata$entitas$Pool$$$undgroupsForIndex$1.apply__O__O(arg1$1)).$$plus$eq__O__scm_ArrayBuffer(group$2);
      i$1 = ((1 + i$1) | 0)
    };
    this.onGroupCreated$1.apply__O__V(new $c_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs().init___Lcom_darkoverlordofdata_entitas_Pool__Lcom_darkoverlordofdata_entitas_Group(this, group$2));
    return group$2
  }
});
$c_Lcom_darkoverlordofdata_entitas_Pool.prototype.getEntities__scm_ArrayBuffer = (function() {
  var this$1 = this.com$darkoverlordofdata$entitas$Pool$$$undentitiesCache$1;
  if ($s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this$1)) {
    var this$2 = this.$$undentities$1;
    var i = 0;
    var len = this$2.table$5.u.length;
    while ((i < len)) {
      var curEntry = this$2.table$5.u[i];
      if ((curEntry !== null)) {
        var arg1 = $s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O(this$2, curEntry);
        var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1);
        this.com$darkoverlordofdata$entitas$Pool$$$undentitiesCache$1.$$plus$eq__O__scm_ArrayBuffer(entity)
      };
      i = ((1 + i) | 0)
    }
  };
  return this.com$darkoverlordofdata$entitas$Pool$$$undentitiesCache$1
});
var $d_Lcom_darkoverlordofdata_entitas_Pool = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_Pool: 0
}, false, "com.darkoverlordofdata.entitas.Pool", {
  Lcom_darkoverlordofdata_entitas_Pool: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_entitas_Pool.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_Pool;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_Pool$() {
  $c_O.call(this);
  this.com$darkoverlordofdata$entitas$Pool$$$undinstance$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_Pool$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_Pool$.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_Pool$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_Pool$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_Pool$.prototype = $c_Lcom_darkoverlordofdata_entitas_Pool$.prototype;
$c_Lcom_darkoverlordofdata_entitas_Pool$.prototype.init___ = (function() {
  this.com$darkoverlordofdata$entitas$Pool$$$undinstance$1 = null;
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Pool$.prototype.setPool__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Pool__V = (function(system, pool) {
  if ($is_Lcom_darkoverlordofdata_entitas_ISetPool(system)) {
    $as_Lcom_darkoverlordofdata_entitas_ISetPool(system).setPool__Lcom_darkoverlordofdata_entitas_Pool__V(pool)
  }
});
var $d_Lcom_darkoverlordofdata_entitas_Pool$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_Pool$: 0
}, false, "com.darkoverlordofdata.entitas.Pool$", {
  Lcom_darkoverlordofdata_entitas_Pool$: 1,
  O: 1
});
$c_Lcom_darkoverlordofdata_entitas_Pool$.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_Pool$;
var $n_Lcom_darkoverlordofdata_entitas_Pool$ = (void 0);
function $m_Lcom_darkoverlordofdata_entitas_Pool$() {
  if ((!$n_Lcom_darkoverlordofdata_entitas_Pool$)) {
    $n_Lcom_darkoverlordofdata_entitas_Pool$ = new $c_Lcom_darkoverlordofdata_entitas_Pool$().init___()
  };
  return $n_Lcom_darkoverlordofdata_entitas_Pool$
}
function $is_Lcom_darkoverlordofdata_entitas_TriggerOnEvent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_TriggerOnEvent)))
}
function $as_Lcom_darkoverlordofdata_entitas_TriggerOnEvent(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_TriggerOnEvent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.TriggerOnEvent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_TriggerOnEvent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_TriggerOnEvent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_TriggerOnEvent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_TriggerOnEvent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.TriggerOnEvent;", depth))
}
var $d_Lcom_darkoverlordofdata_entitas_TriggerOnEvent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_TriggerOnEvent: 0
}, false, "com.darkoverlordofdata.entitas.TriggerOnEvent", {
  Lcom_darkoverlordofdata_entitas_TriggerOnEvent: 1,
  O: 1
});
/** @constructor */
function $c_jl_Class() {
  $c_O.call(this);
  this.data$1 = null
}
$c_jl_Class.prototype = new $h_O();
$c_jl_Class.prototype.constructor = $c_jl_Class;
/** @constructor */
function $h_jl_Class() {
  /*<skip>*/
}
$h_jl_Class.prototype = $c_jl_Class.prototype;
$c_jl_Class.prototype.getName__T = (function() {
  return $as_T(this.data$1.name)
});
$c_jl_Class.prototype.getComponentType__jl_Class = (function() {
  return $as_jl_Class(this.data$1.getComponentType())
});
$c_jl_Class.prototype.isPrimitive__Z = (function() {
  return $uZ(this.data$1.isPrimitive)
});
$c_jl_Class.prototype.toString__T = (function() {
  return ((this.isInterface__Z() ? "interface " : (this.isPrimitive__Z() ? "" : "class ")) + this.getName__T())
});
$c_jl_Class.prototype.isAssignableFrom__jl_Class__Z = (function(that) {
  return ((this.isPrimitive__Z() || that.isPrimitive__Z()) ? ((this === that) || ((this === $d_S.getClassOf()) ? (that === $d_B.getClassOf()) : ((this === $d_I.getClassOf()) ? ((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) : ((this === $d_F.getClassOf()) ? (((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) || (that === $d_I.getClassOf())) : ((this === $d_D.getClassOf()) && ((((that === $d_B.getClassOf()) || (that === $d_S.getClassOf())) || (that === $d_I.getClassOf())) || (that === $d_F.getClassOf()))))))) : this.isInstance__O__Z(that.getFakeInstance__p1__O()))
});
$c_jl_Class.prototype.isInstance__O__Z = (function(obj) {
  return $uZ(this.data$1.isInstance(obj))
});
$c_jl_Class.prototype.init___jl_ScalaJSClassData = (function(data) {
  this.data$1 = data;
  return this
});
$c_jl_Class.prototype.getFakeInstance__p1__O = (function() {
  return this.data$1.getFakeInstance()
});
$c_jl_Class.prototype.newArrayOfThisClass__sjs_js_Array__O = (function(dimensions) {
  return this.data$1.newArrayOfThisClass(dimensions)
});
$c_jl_Class.prototype.isArray__Z = (function() {
  return $uZ(this.data$1.isArrayClass)
});
$c_jl_Class.prototype.isInterface__Z = (function() {
  return $uZ(this.data$1.isInterface)
});
function $is_jl_Class(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_Class)))
}
function $as_jl_Class(obj) {
  return (($is_jl_Class(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Class"))
}
function $isArrayOf_jl_Class(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Class)))
}
function $asArrayOf_jl_Class(obj, depth) {
  return (($isArrayOf_jl_Class(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Class;", depth))
}
var $d_jl_Class = new $TypeData().initClass({
  jl_Class: 0
}, false, "java.lang.Class", {
  jl_Class: 1,
  O: 1
});
$c_jl_Class.prototype.$classData = $d_jl_Class;
/** @constructor */
function $c_jl_System$() {
  $c_O.call(this);
  this.out$1 = null;
  this.err$1 = null;
  this.in$1 = null;
  this.getHighPrecisionTime$1 = null
}
$c_jl_System$.prototype = new $h_O();
$c_jl_System$.prototype.constructor = $c_jl_System$;
/** @constructor */
function $h_jl_System$() {
  /*<skip>*/
}
$h_jl_System$.prototype = $c_jl_System$.prototype;
$c_jl_System$.prototype.init___ = (function() {
  $n_jl_System$ = this;
  this.out$1 = new $c_jl_JSConsoleBasedPrintStream().init___jl_Boolean(false);
  this.err$1 = new $c_jl_JSConsoleBasedPrintStream().init___jl_Boolean(true);
  this.in$1 = null;
  var x = $g.performance;
  if ($uZ((!(!x)))) {
    var x$1 = $g.performance.now;
    if ($uZ((!(!x$1)))) {
      var jsx$1 = (function() {
        return $uD($g.performance.now())
      })
    } else {
      var x$2 = $g.performance.webkitNow;
      if ($uZ((!(!x$2)))) {
        var jsx$1 = (function() {
          return $uD($g.performance.webkitNow())
        })
      } else {
        var jsx$1 = (function() {
          return $uD(new $g.Date().getTime())
        })
      }
    }
  } else {
    var jsx$1 = (function() {
      return $uD(new $g.Date().getTime())
    })
  };
  this.getHighPrecisionTime$1 = jsx$1;
  return this
});
var $d_jl_System$ = new $TypeData().initClass({
  jl_System$: 0
}, false, "java.lang.System$", {
  jl_System$: 1,
  O: 1
});
$c_jl_System$.prototype.$classData = $d_jl_System$;
var $n_jl_System$ = (void 0);
function $m_jl_System$() {
  if ((!$n_jl_System$)) {
    $n_jl_System$ = new $c_jl_System$().init___()
  };
  return $n_jl_System$
}
/** @constructor */
function $c_jl_reflect_Array$() {
  $c_O.call(this)
}
$c_jl_reflect_Array$.prototype = new $h_O();
$c_jl_reflect_Array$.prototype.constructor = $c_jl_reflect_Array$;
/** @constructor */
function $h_jl_reflect_Array$() {
  /*<skip>*/
}
$h_jl_reflect_Array$.prototype = $c_jl_reflect_Array$.prototype;
$c_jl_reflect_Array$.prototype.init___ = (function() {
  return this
});
$c_jl_reflect_Array$.prototype.newInstance__jl_Class__I__O = (function(componentType, length) {
  return componentType.newArrayOfThisClass__sjs_js_Array__O([length])
});
var $d_jl_reflect_Array$ = new $TypeData().initClass({
  jl_reflect_Array$: 0
}, false, "java.lang.reflect.Array$", {
  jl_reflect_Array$: 1,
  O: 1
});
$c_jl_reflect_Array$.prototype.$classData = $d_jl_reflect_Array$;
var $n_jl_reflect_Array$ = (void 0);
function $m_jl_reflect_Array$() {
  if ((!$n_jl_reflect_Array$)) {
    $n_jl_reflect_Array$ = new $c_jl_reflect_Array$().init___()
  };
  return $n_jl_reflect_Array$
}
/** @constructor */
function $c_ju_Arrays$() {
  $c_O.call(this);
  this.inPlaceSortThreshold$1 = 0
}
$c_ju_Arrays$.prototype = new $h_O();
$c_ju_Arrays$.prototype.constructor = $c_ju_Arrays$;
/** @constructor */
function $h_ju_Arrays$() {
  /*<skip>*/
}
$h_ju_Arrays$.prototype = $c_ju_Arrays$.prototype;
$c_ju_Arrays$.prototype.init___ = (function() {
  return this
});
$c_ju_Arrays$.prototype.fill__AI__I__V = (function(a, value) {
  var toIndex = a.u.length;
  var i = 0;
  while ((i !== toIndex)) {
    a.u[i] = value;
    i = ((1 + i) | 0)
  }
});
$c_ju_Arrays$.prototype.java$util$Arrays$$insertionSortAnyRef__AO__I__I__s_math_Ordering__V = (function(a, start, end, ord) {
  var n = ((end - start) | 0);
  if ((n >= 2)) {
    if ((ord.compare__O__O__I(a.u[start], a.u[((1 + start) | 0)]) > 0)) {
      var temp = a.u[start];
      a.u[start] = a.u[((1 + start) | 0)];
      a.u[((1 + start) | 0)] = temp
    };
    var m = 2;
    while ((m < n)) {
      var next = a.u[((start + m) | 0)];
      if ((ord.compare__O__O__I(next, a.u[(((-1) + ((start + m) | 0)) | 0)]) < 0)) {
        var iA = start;
        var iB = (((-1) + ((start + m) | 0)) | 0);
        while ((((iB - iA) | 0) > 1)) {
          var ix = ((((iA + iB) | 0) >>> 1) | 0);
          if ((ord.compare__O__O__I(next, a.u[ix]) < 0)) {
            iB = ix
          } else {
            iA = ix
          }
        };
        var ix$2 = ((iA + ((ord.compare__O__O__I(next, a.u[iA]) < 0) ? 0 : 1)) | 0);
        var i = ((start + m) | 0);
        while ((i > ix$2)) {
          a.u[i] = a.u[(((-1) + i) | 0)];
          i = (((-1) + i) | 0)
        };
        a.u[ix$2] = next
      };
      m = ((1 + m) | 0)
    }
  }
});
$c_ju_Arrays$.prototype.java$util$Arrays$$stableSplitMergeAnyRef__AO__AO__I__I__s_math_Ordering__V = (function(a, temp, start, end, ord) {
  var length = ((end - start) | 0);
  if ((length > 16)) {
    var middle = ((start + ((length / 2) | 0)) | 0);
    this.java$util$Arrays$$stableSplitMergeAnyRef__AO__AO__I__I__s_math_Ordering__V(a, temp, start, middle, ord);
    this.java$util$Arrays$$stableSplitMergeAnyRef__AO__AO__I__I__s_math_Ordering__V(a, temp, middle, end, ord);
    var outIndex = start;
    var leftInIndex = start;
    var rightInIndex = middle;
    while ((outIndex < end)) {
      if ((leftInIndex < middle)) {
        if ((rightInIndex >= end)) {
          var jsx$1 = true
        } else {
          var x = a.u[leftInIndex];
          var y = a.u[rightInIndex];
          var jsx$1 = $s_s_math_Ordering$class__lteq__s_math_Ordering__O__O__Z(ord, x, y)
        }
      } else {
        var jsx$1 = false
      };
      if (jsx$1) {
        temp.u[outIndex] = a.u[leftInIndex];
        leftInIndex = ((1 + leftInIndex) | 0)
      } else {
        temp.u[outIndex] = a.u[rightInIndex];
        rightInIndex = ((1 + rightInIndex) | 0)
      };
      outIndex = ((1 + outIndex) | 0)
    };
    $systemArraycopy(temp, start, a, start, length)
  } else {
    this.java$util$Arrays$$insertionSortAnyRef__AO__I__I__s_math_Ordering__V(a, start, end, ord)
  }
});
$c_ju_Arrays$.prototype.sort__AO__ju_Comparator__V = (function(array, comparator) {
  var ord = new $c_ju_Arrays$$anon$3().init___ju_Comparator(comparator);
  var end = array.u.length;
  if ((end > 16)) {
    this.java$util$Arrays$$stableSplitMergeAnyRef__AO__AO__I__I__s_math_Ordering__V(array, $newArrayObject($d_O.getArrayOf(), [array.u.length]), 0, end, ord)
  } else {
    this.java$util$Arrays$$insertionSortAnyRef__AO__I__I__s_math_Ordering__V(array, 0, end, ord)
  }
});
var $d_ju_Arrays$ = new $TypeData().initClass({
  ju_Arrays$: 0
}, false, "java.util.Arrays$", {
  ju_Arrays$: 1,
  O: 1
});
$c_ju_Arrays$.prototype.$classData = $d_ju_Arrays$;
var $n_ju_Arrays$ = (void 0);
function $m_ju_Arrays$() {
  if ((!$n_ju_Arrays$)) {
    $n_ju_Arrays$ = new $c_ju_Arrays$().init___()
  };
  return $n_ju_Arrays$
}
/** @constructor */
function $c_s_DeprecatedConsole() {
  $c_O.call(this)
}
$c_s_DeprecatedConsole.prototype = new $h_O();
$c_s_DeprecatedConsole.prototype.constructor = $c_s_DeprecatedConsole;
/** @constructor */
function $h_s_DeprecatedConsole() {
  /*<skip>*/
}
$h_s_DeprecatedConsole.prototype = $c_s_DeprecatedConsole.prototype;
/** @constructor */
function $c_s_FallbackArrayBuilding() {
  $c_O.call(this)
}
$c_s_FallbackArrayBuilding.prototype = new $h_O();
$c_s_FallbackArrayBuilding.prototype.constructor = $c_s_FallbackArrayBuilding;
/** @constructor */
function $h_s_FallbackArrayBuilding() {
  /*<skip>*/
}
$h_s_FallbackArrayBuilding.prototype = $c_s_FallbackArrayBuilding.prototype;
/** @constructor */
function $c_s_LowPriorityImplicits() {
  $c_O.call(this)
}
$c_s_LowPriorityImplicits.prototype = new $h_O();
$c_s_LowPriorityImplicits.prototype.constructor = $c_s_LowPriorityImplicits;
/** @constructor */
function $h_s_LowPriorityImplicits() {
  /*<skip>*/
}
$h_s_LowPriorityImplicits.prototype = $c_s_LowPriorityImplicits.prototype;
$c_s_LowPriorityImplicits.prototype.unwrapString__sci_WrappedString__T = (function(ws) {
  return ((ws !== null) ? ws.self$4 : null)
});
/** @constructor */
function $c_s_Predef$any2stringadd$() {
  $c_O.call(this)
}
$c_s_Predef$any2stringadd$.prototype = new $h_O();
$c_s_Predef$any2stringadd$.prototype.constructor = $c_s_Predef$any2stringadd$;
/** @constructor */
function $h_s_Predef$any2stringadd$() {
  /*<skip>*/
}
$h_s_Predef$any2stringadd$.prototype = $c_s_Predef$any2stringadd$.prototype;
$c_s_Predef$any2stringadd$.prototype.init___ = (function() {
  return this
});
$c_s_Predef$any2stringadd$.prototype.$$plus$extension__O__T__T = (function($$this, other) {
  return (("" + $m_sjsr_RuntimeString$().valueOf__O__T($$this)) + other)
});
var $d_s_Predef$any2stringadd$ = new $TypeData().initClass({
  s_Predef$any2stringadd$: 0
}, false, "scala.Predef$any2stringadd$", {
  s_Predef$any2stringadd$: 1,
  O: 1
});
$c_s_Predef$any2stringadd$.prototype.$classData = $d_s_Predef$any2stringadd$;
var $n_s_Predef$any2stringadd$ = (void 0);
function $m_s_Predef$any2stringadd$() {
  if ((!$n_s_Predef$any2stringadd$)) {
    $n_s_Predef$any2stringadd$ = new $c_s_Predef$any2stringadd$().init___()
  };
  return $n_s_Predef$any2stringadd$
}
/** @constructor */
function $c_s_math_Ordered$() {
  $c_O.call(this)
}
$c_s_math_Ordered$.prototype = new $h_O();
$c_s_math_Ordered$.prototype.constructor = $c_s_math_Ordered$;
/** @constructor */
function $h_s_math_Ordered$() {
  /*<skip>*/
}
$h_s_math_Ordered$.prototype = $c_s_math_Ordered$.prototype;
$c_s_math_Ordered$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Ordered$ = new $TypeData().initClass({
  s_math_Ordered$: 0
}, false, "scala.math.Ordered$", {
  s_math_Ordered$: 1,
  O: 1
});
$c_s_math_Ordered$.prototype.$classData = $d_s_math_Ordered$;
var $n_s_math_Ordered$ = (void 0);
function $m_s_math_Ordered$() {
  if ((!$n_s_math_Ordered$)) {
    $n_s_math_Ordered$ = new $c_s_math_Ordered$().init___()
  };
  return $n_s_math_Ordered$
}
/** @constructor */
function $c_s_package$() {
  $c_O.call(this);
  this.AnyRef$1 = null;
  this.Traversable$1 = null;
  this.Iterable$1 = null;
  this.Seq$1 = null;
  this.IndexedSeq$1 = null;
  this.Iterator$1 = null;
  this.List$1 = null;
  this.Nil$1 = null;
  this.$$colon$colon$1 = null;
  this.$$plus$colon$1 = null;
  this.$$colon$plus$1 = null;
  this.Stream$1 = null;
  this.$$hash$colon$colon$1 = null;
  this.Vector$1 = null;
  this.StringBuilder$1 = null;
  this.Range$1 = null;
  this.BigDecimal$1 = null;
  this.BigInt$1 = null;
  this.Equiv$1 = null;
  this.Fractional$1 = null;
  this.Integral$1 = null;
  this.Numeric$1 = null;
  this.Ordered$1 = null;
  this.Ordering$1 = null;
  this.Either$1 = null;
  this.Left$1 = null;
  this.Right$1 = null;
  this.bitmap$0$1 = 0
}
$c_s_package$.prototype = new $h_O();
$c_s_package$.prototype.constructor = $c_s_package$;
/** @constructor */
function $h_s_package$() {
  /*<skip>*/
}
$h_s_package$.prototype = $c_s_package$.prototype;
$c_s_package$.prototype.init___ = (function() {
  $n_s_package$ = this;
  this.AnyRef$1 = new $c_s_package$$anon$1().init___();
  this.Traversable$1 = $m_sc_Traversable$();
  this.Iterable$1 = $m_sc_Iterable$();
  this.Seq$1 = $m_sc_Seq$();
  this.IndexedSeq$1 = $m_sc_IndexedSeq$();
  this.Iterator$1 = $m_sc_Iterator$();
  this.List$1 = $m_sci_List$();
  this.Nil$1 = $m_sci_Nil$();
  this.$$colon$colon$1 = $m_sci_$colon$colon$();
  this.$$plus$colon$1 = $m_sc_$plus$colon$();
  this.$$colon$plus$1 = $m_sc_$colon$plus$();
  this.Stream$1 = $m_sci_Stream$();
  this.$$hash$colon$colon$1 = $m_sci_Stream$$hash$colon$colon$();
  this.Vector$1 = $m_sci_Vector$();
  this.StringBuilder$1 = $m_scm_StringBuilder$();
  this.Range$1 = $m_sci_Range$();
  this.Equiv$1 = $m_s_math_Equiv$();
  this.Fractional$1 = $m_s_math_Fractional$();
  this.Integral$1 = $m_s_math_Integral$();
  this.Numeric$1 = $m_s_math_Numeric$();
  this.Ordered$1 = $m_s_math_Ordered$();
  this.Ordering$1 = $m_s_math_Ordering$();
  this.Either$1 = $m_s_util_Either$();
  this.Left$1 = $m_s_util_Left$();
  this.Right$1 = $m_s_util_Right$();
  return this
});
var $d_s_package$ = new $TypeData().initClass({
  s_package$: 0
}, false, "scala.package$", {
  s_package$: 1,
  O: 1
});
$c_s_package$.prototype.$classData = $d_s_package$;
var $n_s_package$ = (void 0);
function $m_s_package$() {
  if ((!$n_s_package$)) {
    $n_s_package$ = new $c_s_package$().init___()
  };
  return $n_s_package$
}
/** @constructor */
function $c_s_reflect_ClassManifestFactory$() {
  $c_O.call(this);
  this.Byte$1 = null;
  this.Short$1 = null;
  this.Char$1 = null;
  this.Int$1 = null;
  this.Long$1 = null;
  this.Float$1 = null;
  this.Double$1 = null;
  this.Boolean$1 = null;
  this.Unit$1 = null;
  this.Any$1 = null;
  this.Object$1 = null;
  this.AnyVal$1 = null;
  this.Nothing$1 = null;
  this.Null$1 = null
}
$c_s_reflect_ClassManifestFactory$.prototype = new $h_O();
$c_s_reflect_ClassManifestFactory$.prototype.constructor = $c_s_reflect_ClassManifestFactory$;
/** @constructor */
function $h_s_reflect_ClassManifestFactory$() {
  /*<skip>*/
}
$h_s_reflect_ClassManifestFactory$.prototype = $c_s_reflect_ClassManifestFactory$.prototype;
$c_s_reflect_ClassManifestFactory$.prototype.init___ = (function() {
  $n_s_reflect_ClassManifestFactory$ = this;
  this.Byte$1 = $m_s_reflect_ManifestFactory$ByteManifest$();
  this.Short$1 = $m_s_reflect_ManifestFactory$ShortManifest$();
  this.Char$1 = $m_s_reflect_ManifestFactory$CharManifest$();
  this.Int$1 = $m_s_reflect_ManifestFactory$IntManifest$();
  this.Long$1 = $m_s_reflect_ManifestFactory$LongManifest$();
  this.Float$1 = $m_s_reflect_ManifestFactory$FloatManifest$();
  this.Double$1 = $m_s_reflect_ManifestFactory$DoubleManifest$();
  this.Boolean$1 = $m_s_reflect_ManifestFactory$BooleanManifest$();
  this.Unit$1 = $m_s_reflect_ManifestFactory$UnitManifest$();
  this.Any$1 = $m_s_reflect_ManifestFactory$AnyManifest$();
  this.Object$1 = $m_s_reflect_ManifestFactory$ObjectManifest$();
  this.AnyVal$1 = $m_s_reflect_ManifestFactory$AnyValManifest$();
  this.Nothing$1 = $m_s_reflect_ManifestFactory$NothingManifest$();
  this.Null$1 = $m_s_reflect_ManifestFactory$NullManifest$();
  return this
});
var $d_s_reflect_ClassManifestFactory$ = new $TypeData().initClass({
  s_reflect_ClassManifestFactory$: 0
}, false, "scala.reflect.ClassManifestFactory$", {
  s_reflect_ClassManifestFactory$: 1,
  O: 1
});
$c_s_reflect_ClassManifestFactory$.prototype.$classData = $d_s_reflect_ClassManifestFactory$;
var $n_s_reflect_ClassManifestFactory$ = (void 0);
function $m_s_reflect_ClassManifestFactory$() {
  if ((!$n_s_reflect_ClassManifestFactory$)) {
    $n_s_reflect_ClassManifestFactory$ = new $c_s_reflect_ClassManifestFactory$().init___()
  };
  return $n_s_reflect_ClassManifestFactory$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$() {
  $c_O.call(this)
}
$c_s_reflect_ManifestFactory$.prototype = new $h_O();
$c_s_reflect_ManifestFactory$.prototype.constructor = $c_s_reflect_ManifestFactory$;
/** @constructor */
function $h_s_reflect_ManifestFactory$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$.prototype = $c_s_reflect_ManifestFactory$.prototype;
$c_s_reflect_ManifestFactory$.prototype.init___ = (function() {
  return this
});
var $d_s_reflect_ManifestFactory$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$: 0
}, false, "scala.reflect.ManifestFactory$", {
  s_reflect_ManifestFactory$: 1,
  O: 1
});
$c_s_reflect_ManifestFactory$.prototype.$classData = $d_s_reflect_ManifestFactory$;
var $n_s_reflect_ManifestFactory$ = (void 0);
function $m_s_reflect_ManifestFactory$() {
  if ((!$n_s_reflect_ManifestFactory$)) {
    $n_s_reflect_ManifestFactory$ = new $c_s_reflect_ManifestFactory$().init___()
  };
  return $n_s_reflect_ManifestFactory$
}
/** @constructor */
function $c_s_reflect_package$() {
  $c_O.call(this);
  this.ClassManifest$1 = null;
  this.Manifest$1 = null
}
$c_s_reflect_package$.prototype = new $h_O();
$c_s_reflect_package$.prototype.constructor = $c_s_reflect_package$;
/** @constructor */
function $h_s_reflect_package$() {
  /*<skip>*/
}
$h_s_reflect_package$.prototype = $c_s_reflect_package$.prototype;
$c_s_reflect_package$.prototype.init___ = (function() {
  $n_s_reflect_package$ = this;
  this.ClassManifest$1 = $m_s_reflect_ClassManifestFactory$();
  this.Manifest$1 = $m_s_reflect_ManifestFactory$();
  return this
});
var $d_s_reflect_package$ = new $TypeData().initClass({
  s_reflect_package$: 0
}, false, "scala.reflect.package$", {
  s_reflect_package$: 1,
  O: 1
});
$c_s_reflect_package$.prototype.$classData = $d_s_reflect_package$;
var $n_s_reflect_package$ = (void 0);
function $m_s_reflect_package$() {
  if ((!$n_s_reflect_package$)) {
    $n_s_reflect_package$ = new $c_s_reflect_package$().init___()
  };
  return $n_s_reflect_package$
}
/** @constructor */
function $c_s_util_DynamicVariable() {
  $c_O.call(this);
  this.v$1 = null
}
$c_s_util_DynamicVariable.prototype = new $h_O();
$c_s_util_DynamicVariable.prototype.constructor = $c_s_util_DynamicVariable;
/** @constructor */
function $h_s_util_DynamicVariable() {
  /*<skip>*/
}
$h_s_util_DynamicVariable.prototype = $c_s_util_DynamicVariable.prototype;
$c_s_util_DynamicVariable.prototype.toString__T = (function() {
  return (("DynamicVariable(" + this.v$1) + ")")
});
$c_s_util_DynamicVariable.prototype.init___O = (function(init) {
  this.v$1 = init;
  return this
});
var $d_s_util_DynamicVariable = new $TypeData().initClass({
  s_util_DynamicVariable: 0
}, false, "scala.util.DynamicVariable", {
  s_util_DynamicVariable: 1,
  O: 1
});
$c_s_util_DynamicVariable.prototype.$classData = $d_s_util_DynamicVariable;
/** @constructor */
function $c_s_util_Either$() {
  $c_O.call(this)
}
$c_s_util_Either$.prototype = new $h_O();
$c_s_util_Either$.prototype.constructor = $c_s_util_Either$;
/** @constructor */
function $h_s_util_Either$() {
  /*<skip>*/
}
$h_s_util_Either$.prototype = $c_s_util_Either$.prototype;
$c_s_util_Either$.prototype.init___ = (function() {
  return this
});
var $d_s_util_Either$ = new $TypeData().initClass({
  s_util_Either$: 0
}, false, "scala.util.Either$", {
  s_util_Either$: 1,
  O: 1
});
$c_s_util_Either$.prototype.$classData = $d_s_util_Either$;
var $n_s_util_Either$ = (void 0);
function $m_s_util_Either$() {
  if ((!$n_s_util_Either$)) {
    $n_s_util_Either$ = new $c_s_util_Either$().init___()
  };
  return $n_s_util_Either$
}
/** @constructor */
function $c_s_util_control_Breaks() {
  $c_O.call(this);
  this.scala$util$control$Breaks$$breakException$1 = null
}
$c_s_util_control_Breaks.prototype = new $h_O();
$c_s_util_control_Breaks.prototype.constructor = $c_s_util_control_Breaks;
/** @constructor */
function $h_s_util_control_Breaks() {
  /*<skip>*/
}
$h_s_util_control_Breaks.prototype = $c_s_util_control_Breaks.prototype;
$c_s_util_control_Breaks.prototype.init___ = (function() {
  this.scala$util$control$Breaks$$breakException$1 = new $c_s_util_control_BreakControl().init___();
  return this
});
var $d_s_util_control_Breaks = new $TypeData().initClass({
  s_util_control_Breaks: 0
}, false, "scala.util.control.Breaks", {
  s_util_control_Breaks: 1,
  O: 1
});
$c_s_util_control_Breaks.prototype.$classData = $d_s_util_control_Breaks;
/** @constructor */
function $c_s_util_hashing_MurmurHash3() {
  $c_O.call(this)
}
$c_s_util_hashing_MurmurHash3.prototype = new $h_O();
$c_s_util_hashing_MurmurHash3.prototype.constructor = $c_s_util_hashing_MurmurHash3;
/** @constructor */
function $h_s_util_hashing_MurmurHash3() {
  /*<skip>*/
}
$h_s_util_hashing_MurmurHash3.prototype = $c_s_util_hashing_MurmurHash3.prototype;
$c_s_util_hashing_MurmurHash3.prototype.mixLast__I__I__I = (function(hash, data) {
  var k = data;
  k = $imul((-862048943), k);
  var i = k;
  k = ((i << 15) | ((i >>> 17) | 0));
  k = $imul(461845907, k);
  return (hash ^ k)
});
$c_s_util_hashing_MurmurHash3.prototype.mix__I__I__I = (function(hash, data) {
  var h = this.mixLast__I__I__I(hash, data);
  var i = h;
  h = ((i << 13) | ((i >>> 19) | 0));
  return (((-430675100) + $imul(5, h)) | 0)
});
$c_s_util_hashing_MurmurHash3.prototype.avalanche__p1__I__I = (function(hash) {
  var h = hash;
  h = (h ^ ((h >>> 16) | 0));
  h = $imul((-2048144789), h);
  h = (h ^ ((h >>> 13) | 0));
  h = $imul((-1028477387), h);
  h = (h ^ ((h >>> 16) | 0));
  return h
});
$c_s_util_hashing_MurmurHash3.prototype.unorderedHash__sc_TraversableOnce__I__I = (function(xs, seed) {
  var a = new $c_sr_IntRef().init___I(0);
  var b = new $c_sr_IntRef().init___I(0);
  var n = new $c_sr_IntRef().init___I(0);
  var c = new $c_sr_IntRef().init___I(1);
  xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, a$1, b$1, n$1, c$1) {
    return (function(x$2) {
      var h = $m_sr_ScalaRunTime$().hash__O__I(x$2);
      a$1.elem$1 = ((a$1.elem$1 + h) | 0);
      b$1.elem$1 = (b$1.elem$1 ^ h);
      if ((h !== 0)) {
        c$1.elem$1 = $imul(c$1.elem$1, h)
      };
      n$1.elem$1 = ((1 + n$1.elem$1) | 0)
    })
  })(this, a, b, n, c)));
  var h$1 = seed;
  h$1 = this.mix__I__I__I(h$1, a.elem$1);
  h$1 = this.mix__I__I__I(h$1, b.elem$1);
  h$1 = this.mixLast__I__I__I(h$1, c.elem$1);
  return this.finalizeHash__I__I__I(h$1, n.elem$1)
});
$c_s_util_hashing_MurmurHash3.prototype.productHash__s_Product__I__I = (function(x, seed) {
  var arr = x.productArity__I();
  if ((arr === 0)) {
    var this$1 = x.productPrefix__T();
    return $m_sjsr_RuntimeString$().hashCode__T__I(this$1)
  } else {
    var h = seed;
    var i = 0;
    while ((i < arr)) {
      h = this.mix__I__I__I(h, $m_sr_ScalaRunTime$().hash__O__I(x.productElement__I__O(i)));
      i = ((1 + i) | 0)
    };
    return this.finalizeHash__I__I__I(h, arr)
  }
});
$c_s_util_hashing_MurmurHash3.prototype.finalizeHash__I__I__I = (function(hash, length) {
  return this.avalanche__p1__I__I((hash ^ length))
});
$c_s_util_hashing_MurmurHash3.prototype.orderedHash__sc_TraversableOnce__I__I = (function(xs, seed) {
  var n = new $c_sr_IntRef().init___I(0);
  var h = new $c_sr_IntRef().init___I(seed);
  xs.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, n$1, h$1) {
    return (function(x$2) {
      h$1.elem$1 = $this.mix__I__I__I(h$1.elem$1, $m_sr_ScalaRunTime$().hash__O__I(x$2));
      n$1.elem$1 = ((1 + n$1.elem$1) | 0)
    })
  })(this, n, h)));
  return this.finalizeHash__I__I__I(h.elem$1, n.elem$1)
});
$c_s_util_hashing_MurmurHash3.prototype.listHash__sci_List__I__I = (function(xs, seed) {
  var n = 0;
  var h = seed;
  var elems = xs;
  while ((!elems.isEmpty__Z())) {
    var head = elems.head__O();
    var tail = $as_sci_List(elems.tail__O());
    h = this.mix__I__I__I(h, $m_sr_ScalaRunTime$().hash__O__I(head));
    n = ((1 + n) | 0);
    elems = tail
  };
  return this.finalizeHash__I__I__I(h, n)
});
/** @constructor */
function $c_s_util_hashing_package$() {
  $c_O.call(this)
}
$c_s_util_hashing_package$.prototype = new $h_O();
$c_s_util_hashing_package$.prototype.constructor = $c_s_util_hashing_package$;
/** @constructor */
function $h_s_util_hashing_package$() {
  /*<skip>*/
}
$h_s_util_hashing_package$.prototype = $c_s_util_hashing_package$.prototype;
$c_s_util_hashing_package$.prototype.init___ = (function() {
  return this
});
$c_s_util_hashing_package$.prototype.byteswap32__I__I = (function(v) {
  var hc = $imul((-1640532531), v);
  hc = $m_jl_Integer$().reverseBytes__I__I(hc);
  return $imul((-1640532531), hc)
});
var $d_s_util_hashing_package$ = new $TypeData().initClass({
  s_util_hashing_package$: 0
}, false, "scala.util.hashing.package$", {
  s_util_hashing_package$: 1,
  O: 1
});
$c_s_util_hashing_package$.prototype.$classData = $d_s_util_hashing_package$;
var $n_s_util_hashing_package$ = (void 0);
function $m_s_util_hashing_package$() {
  if ((!$n_s_util_hashing_package$)) {
    $n_s_util_hashing_package$ = new $c_s_util_hashing_package$().init___()
  };
  return $n_s_util_hashing_package$
}
/** @constructor */
function $c_sc_$colon$plus$() {
  $c_O.call(this)
}
$c_sc_$colon$plus$.prototype = new $h_O();
$c_sc_$colon$plus$.prototype.constructor = $c_sc_$colon$plus$;
/** @constructor */
function $h_sc_$colon$plus$() {
  /*<skip>*/
}
$h_sc_$colon$plus$.prototype = $c_sc_$colon$plus$.prototype;
$c_sc_$colon$plus$.prototype.init___ = (function() {
  return this
});
var $d_sc_$colon$plus$ = new $TypeData().initClass({
  sc_$colon$plus$: 0
}, false, "scala.collection.$colon$plus$", {
  sc_$colon$plus$: 1,
  O: 1
});
$c_sc_$colon$plus$.prototype.$classData = $d_sc_$colon$plus$;
var $n_sc_$colon$plus$ = (void 0);
function $m_sc_$colon$plus$() {
  if ((!$n_sc_$colon$plus$)) {
    $n_sc_$colon$plus$ = new $c_sc_$colon$plus$().init___()
  };
  return $n_sc_$colon$plus$
}
/** @constructor */
function $c_sc_$plus$colon$() {
  $c_O.call(this)
}
$c_sc_$plus$colon$.prototype = new $h_O();
$c_sc_$plus$colon$.prototype.constructor = $c_sc_$plus$colon$;
/** @constructor */
function $h_sc_$plus$colon$() {
  /*<skip>*/
}
$h_sc_$plus$colon$.prototype = $c_sc_$plus$colon$.prototype;
$c_sc_$plus$colon$.prototype.init___ = (function() {
  return this
});
var $d_sc_$plus$colon$ = new $TypeData().initClass({
  sc_$plus$colon$: 0
}, false, "scala.collection.$plus$colon$", {
  sc_$plus$colon$: 1,
  O: 1
});
$c_sc_$plus$colon$.prototype.$classData = $d_sc_$plus$colon$;
var $n_sc_$plus$colon$ = (void 0);
function $m_sc_$plus$colon$() {
  if ((!$n_sc_$plus$colon$)) {
    $n_sc_$plus$colon$ = new $c_sc_$plus$colon$().init___()
  };
  return $n_sc_$plus$colon$
}
/** @constructor */
function $c_sc_Iterator$() {
  $c_O.call(this);
  this.empty$1 = null
}
$c_sc_Iterator$.prototype = new $h_O();
$c_sc_Iterator$.prototype.constructor = $c_sc_Iterator$;
/** @constructor */
function $h_sc_Iterator$() {
  /*<skip>*/
}
$h_sc_Iterator$.prototype = $c_sc_Iterator$.prototype;
$c_sc_Iterator$.prototype.init___ = (function() {
  $n_sc_Iterator$ = this;
  this.empty$1 = new $c_sc_Iterator$$anon$2().init___();
  return this
});
var $d_sc_Iterator$ = new $TypeData().initClass({
  sc_Iterator$: 0
}, false, "scala.collection.Iterator$", {
  sc_Iterator$: 1,
  O: 1
});
$c_sc_Iterator$.prototype.$classData = $d_sc_Iterator$;
var $n_sc_Iterator$ = (void 0);
function $m_sc_Iterator$() {
  if ((!$n_sc_Iterator$)) {
    $n_sc_Iterator$ = new $c_sc_Iterator$().init___()
  };
  return $n_sc_Iterator$
}
function $is_sc_TraversableOnce(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_TraversableOnce)))
}
function $as_sc_TraversableOnce(obj) {
  return (($is_sc_TraversableOnce(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.TraversableOnce"))
}
function $isArrayOf_sc_TraversableOnce(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_TraversableOnce)))
}
function $asArrayOf_sc_TraversableOnce(obj, depth) {
  return (($isArrayOf_sc_TraversableOnce(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.TraversableOnce;", depth))
}
/** @constructor */
function $c_scg_GenMapFactory() {
  $c_O.call(this)
}
$c_scg_GenMapFactory.prototype = new $h_O();
$c_scg_GenMapFactory.prototype.constructor = $c_scg_GenMapFactory;
/** @constructor */
function $h_scg_GenMapFactory() {
  /*<skip>*/
}
$h_scg_GenMapFactory.prototype = $c_scg_GenMapFactory.prototype;
/** @constructor */
function $c_scg_GenericCompanion() {
  $c_O.call(this)
}
$c_scg_GenericCompanion.prototype = new $h_O();
$c_scg_GenericCompanion.prototype.constructor = $c_scg_GenericCompanion;
/** @constructor */
function $h_scg_GenericCompanion() {
  /*<skip>*/
}
$h_scg_GenericCompanion.prototype = $c_scg_GenericCompanion.prototype;
$c_scg_GenericCompanion.prototype.apply__sc_Seq__sc_GenTraversable = (function(elems) {
  if (elems.isEmpty__Z()) {
    return this.empty__sc_GenTraversable()
  } else {
    var b = this.newBuilder__scm_Builder();
    b.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(elems);
    return $as_sc_GenTraversable(b.result__O())
  }
});
$c_scg_GenericCompanion.prototype.empty__sc_GenTraversable = (function() {
  return $as_sc_GenTraversable(this.newBuilder__scm_Builder().result__O())
});
function $is_scg_Growable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scg_Growable)))
}
function $as_scg_Growable(obj) {
  return (($is_scg_Growable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.generic.Growable"))
}
function $isArrayOf_scg_Growable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scg_Growable)))
}
function $asArrayOf_scg_Growable(obj, depth) {
  return (($isArrayOf_scg_Growable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.generic.Growable;", depth))
}
/** @constructor */
function $c_sci_Stream$$hash$colon$colon$() {
  $c_O.call(this)
}
$c_sci_Stream$$hash$colon$colon$.prototype = new $h_O();
$c_sci_Stream$$hash$colon$colon$.prototype.constructor = $c_sci_Stream$$hash$colon$colon$;
/** @constructor */
function $h_sci_Stream$$hash$colon$colon$() {
  /*<skip>*/
}
$h_sci_Stream$$hash$colon$colon$.prototype = $c_sci_Stream$$hash$colon$colon$.prototype;
$c_sci_Stream$$hash$colon$colon$.prototype.init___ = (function() {
  return this
});
var $d_sci_Stream$$hash$colon$colon$ = new $TypeData().initClass({
  sci_Stream$$hash$colon$colon$: 0
}, false, "scala.collection.immutable.Stream$$hash$colon$colon$", {
  sci_Stream$$hash$colon$colon$: 1,
  O: 1
});
$c_sci_Stream$$hash$colon$colon$.prototype.$classData = $d_sci_Stream$$hash$colon$colon$;
var $n_sci_Stream$$hash$colon$colon$ = (void 0);
function $m_sci_Stream$$hash$colon$colon$() {
  if ((!$n_sci_Stream$$hash$colon$colon$)) {
    $n_sci_Stream$$hash$colon$colon$ = new $c_sci_Stream$$hash$colon$colon$().init___()
  };
  return $n_sci_Stream$$hash$colon$colon$
}
/** @constructor */
function $c_sci_StreamIterator$LazyCell() {
  $c_O.call(this);
  this.st$1 = null;
  this.v$1 = null;
  this.$$outer$f = null;
  this.bitmap$0$1 = false
}
$c_sci_StreamIterator$LazyCell.prototype = new $h_O();
$c_sci_StreamIterator$LazyCell.prototype.constructor = $c_sci_StreamIterator$LazyCell;
/** @constructor */
function $h_sci_StreamIterator$LazyCell() {
  /*<skip>*/
}
$h_sci_StreamIterator$LazyCell.prototype = $c_sci_StreamIterator$LazyCell.prototype;
$c_sci_StreamIterator$LazyCell.prototype.init___sci_StreamIterator__F0 = (function($$outer, st) {
  this.st$1 = st;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
$c_sci_StreamIterator$LazyCell.prototype.v$lzycompute__p1__sci_Stream = (function() {
  if ((!this.bitmap$0$1)) {
    this.v$1 = $as_sci_Stream(this.st$1.apply__O());
    this.bitmap$0$1 = true
  };
  this.st$1 = null;
  return this.v$1
});
$c_sci_StreamIterator$LazyCell.prototype.v__sci_Stream = (function() {
  return ((!this.bitmap$0$1) ? this.v$lzycompute__p1__sci_Stream() : this.v$1)
});
var $d_sci_StreamIterator$LazyCell = new $TypeData().initClass({
  sci_StreamIterator$LazyCell: 0
}, false, "scala.collection.immutable.StreamIterator$LazyCell", {
  sci_StreamIterator$LazyCell: 1,
  O: 1
});
$c_sci_StreamIterator$LazyCell.prototype.$classData = $d_sci_StreamIterator$LazyCell;
/** @constructor */
function $c_sci_StringOps$() {
  $c_O.call(this)
}
$c_sci_StringOps$.prototype = new $h_O();
$c_sci_StringOps$.prototype.constructor = $c_sci_StringOps$;
/** @constructor */
function $h_sci_StringOps$() {
  /*<skip>*/
}
$h_sci_StringOps$.prototype = $c_sci_StringOps$.prototype;
$c_sci_StringOps$.prototype.init___ = (function() {
  return this
});
$c_sci_StringOps$.prototype.equals$extension__T__O__Z = (function($$this, x$1) {
  if ($is_sci_StringOps(x$1)) {
    var StringOps$1 = ((x$1 === null) ? null : $as_sci_StringOps(x$1).repr$1);
    return ($$this === StringOps$1)
  } else {
    return false
  }
});
$c_sci_StringOps$.prototype.slice$extension__T__I__I__T = (function($$this, from, until) {
  var start = ((from < 0) ? 0 : from);
  if (((until <= start) || (start >= $uI($$this.length)))) {
    return ""
  };
  var end = ((until > $uI($$this.length)) ? $uI($$this.length) : until);
  return $as_T($$this.substring(start, end))
});
var $d_sci_StringOps$ = new $TypeData().initClass({
  sci_StringOps$: 0
}, false, "scala.collection.immutable.StringOps$", {
  sci_StringOps$: 1,
  O: 1
});
$c_sci_StringOps$.prototype.$classData = $d_sci_StringOps$;
var $n_sci_StringOps$ = (void 0);
function $m_sci_StringOps$() {
  if ((!$n_sci_StringOps$)) {
    $n_sci_StringOps$ = new $c_sci_StringOps$().init___()
  };
  return $n_sci_StringOps$
}
/** @constructor */
function $c_sci_WrappedString$() {
  $c_O.call(this)
}
$c_sci_WrappedString$.prototype = new $h_O();
$c_sci_WrappedString$.prototype.constructor = $c_sci_WrappedString$;
/** @constructor */
function $h_sci_WrappedString$() {
  /*<skip>*/
}
$h_sci_WrappedString$.prototype = $c_sci_WrappedString$.prototype;
$c_sci_WrappedString$.prototype.init___ = (function() {
  return this
});
$c_sci_WrappedString$.prototype.newBuilder__scm_Builder = (function() {
  var this$2 = new $c_scm_StringBuilder().init___();
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$2) {
      var x = $as_T(x$2);
      return new $c_sci_WrappedString().init___T(x)
    })
  })(this));
  return new $c_scm_Builder$$anon$1().init___scm_Builder__F1(this$2, f)
});
var $d_sci_WrappedString$ = new $TypeData().initClass({
  sci_WrappedString$: 0
}, false, "scala.collection.immutable.WrappedString$", {
  sci_WrappedString$: 1,
  O: 1
});
$c_sci_WrappedString$.prototype.$classData = $d_sci_WrappedString$;
var $n_sci_WrappedString$ = (void 0);
function $m_sci_WrappedString$() {
  if ((!$n_sci_WrappedString$)) {
    $n_sci_WrappedString$ = new $c_sci_WrappedString$().init___()
  };
  return $n_sci_WrappedString$
}
/** @constructor */
function $c_scm_ArrayOps$ofInt$() {
  $c_O.call(this)
}
$c_scm_ArrayOps$ofInt$.prototype = new $h_O();
$c_scm_ArrayOps$ofInt$.prototype.constructor = $c_scm_ArrayOps$ofInt$;
/** @constructor */
function $h_scm_ArrayOps$ofInt$() {
  /*<skip>*/
}
$h_scm_ArrayOps$ofInt$.prototype = $c_scm_ArrayOps$ofInt$.prototype;
$c_scm_ArrayOps$ofInt$.prototype.init___ = (function() {
  return this
});
$c_scm_ArrayOps$ofInt$.prototype.equals$extension__AI__O__Z = (function($$this, x$1) {
  if ($is_scm_ArrayOps$ofInt(x$1)) {
    var ofInt$1 = ((x$1 === null) ? null : $as_scm_ArrayOps$ofInt(x$1).repr$1);
    return ($$this === ofInt$1)
  } else {
    return false
  }
});
var $d_scm_ArrayOps$ofInt$ = new $TypeData().initClass({
  scm_ArrayOps$ofInt$: 0
}, false, "scala.collection.mutable.ArrayOps$ofInt$", {
  scm_ArrayOps$ofInt$: 1,
  O: 1
});
$c_scm_ArrayOps$ofInt$.prototype.$classData = $d_scm_ArrayOps$ofInt$;
var $n_scm_ArrayOps$ofInt$ = (void 0);
function $m_scm_ArrayOps$ofInt$() {
  if ((!$n_scm_ArrayOps$ofInt$)) {
    $n_scm_ArrayOps$ofInt$ = new $c_scm_ArrayOps$ofInt$().init___()
  };
  return $n_scm_ArrayOps$ofInt$
}
/** @constructor */
function $c_scm_ArrayOps$ofRef$() {
  $c_O.call(this)
}
$c_scm_ArrayOps$ofRef$.prototype = new $h_O();
$c_scm_ArrayOps$ofRef$.prototype.constructor = $c_scm_ArrayOps$ofRef$;
/** @constructor */
function $h_scm_ArrayOps$ofRef$() {
  /*<skip>*/
}
$h_scm_ArrayOps$ofRef$.prototype = $c_scm_ArrayOps$ofRef$.prototype;
$c_scm_ArrayOps$ofRef$.prototype.init___ = (function() {
  return this
});
$c_scm_ArrayOps$ofRef$.prototype.equals$extension__AO__O__Z = (function($$this, x$1) {
  if ($is_scm_ArrayOps$ofRef(x$1)) {
    var ofRef$1 = ((x$1 === null) ? null : $as_scm_ArrayOps$ofRef(x$1).repr$1);
    return ($$this === ofRef$1)
  } else {
    return false
  }
});
var $d_scm_ArrayOps$ofRef$ = new $TypeData().initClass({
  scm_ArrayOps$ofRef$: 0
}, false, "scala.collection.mutable.ArrayOps$ofRef$", {
  scm_ArrayOps$ofRef$: 1,
  O: 1
});
$c_scm_ArrayOps$ofRef$.prototype.$classData = $d_scm_ArrayOps$ofRef$;
var $n_scm_ArrayOps$ofRef$ = (void 0);
function $m_scm_ArrayOps$ofRef$() {
  if ((!$n_scm_ArrayOps$ofRef$)) {
    $n_scm_ArrayOps$ofRef$ = new $c_scm_ArrayOps$ofRef$().init___()
  };
  return $n_scm_ArrayOps$ofRef$
}
/** @constructor */
function $c_scm_FlatHashTable$() {
  $c_O.call(this)
}
$c_scm_FlatHashTable$.prototype = new $h_O();
$c_scm_FlatHashTable$.prototype.constructor = $c_scm_FlatHashTable$;
/** @constructor */
function $h_scm_FlatHashTable$() {
  /*<skip>*/
}
$h_scm_FlatHashTable$.prototype = $c_scm_FlatHashTable$.prototype;
$c_scm_FlatHashTable$.prototype.init___ = (function() {
  return this
});
$c_scm_FlatHashTable$.prototype.newThreshold__I__I__I = (function(_loadFactor, size) {
  var assertion = (_loadFactor < 500);
  if ((!assertion)) {
    throw new $c_jl_AssertionError().init___O("assertion failed: loadFactor too large; must be < 0.5")
  };
  var hi = (size >> 31);
  var hi$1 = (_loadFactor >> 31);
  var lo = $imul(size, _loadFactor);
  var hi$2 = $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$timesHi__I__I__I__I__I(size, hi, _loadFactor, hi$1);
  var this$2 = $m_sjsr_RuntimeLong$();
  var lo$1 = this$2.divideImpl__I__I__I__I__I(lo, hi$2, 1000, 0);
  return lo$1
});
var $d_scm_FlatHashTable$ = new $TypeData().initClass({
  scm_FlatHashTable$: 0
}, false, "scala.collection.mutable.FlatHashTable$", {
  scm_FlatHashTable$: 1,
  O: 1
});
$c_scm_FlatHashTable$.prototype.$classData = $d_scm_FlatHashTable$;
var $n_scm_FlatHashTable$ = (void 0);
function $m_scm_FlatHashTable$() {
  if ((!$n_scm_FlatHashTable$)) {
    $n_scm_FlatHashTable$ = new $c_scm_FlatHashTable$().init___()
  };
  return $n_scm_FlatHashTable$
}
/** @constructor */
function $c_scm_FlatHashTable$NullSentinel$() {
  $c_O.call(this)
}
$c_scm_FlatHashTable$NullSentinel$.prototype = new $h_O();
$c_scm_FlatHashTable$NullSentinel$.prototype.constructor = $c_scm_FlatHashTable$NullSentinel$;
/** @constructor */
function $h_scm_FlatHashTable$NullSentinel$() {
  /*<skip>*/
}
$h_scm_FlatHashTable$NullSentinel$.prototype = $c_scm_FlatHashTable$NullSentinel$.prototype;
$c_scm_FlatHashTable$NullSentinel$.prototype.init___ = (function() {
  return this
});
$c_scm_FlatHashTable$NullSentinel$.prototype.toString__T = (function() {
  return "NullSentinel"
});
$c_scm_FlatHashTable$NullSentinel$.prototype.hashCode__I = (function() {
  return 0
});
var $d_scm_FlatHashTable$NullSentinel$ = new $TypeData().initClass({
  scm_FlatHashTable$NullSentinel$: 0
}, false, "scala.collection.mutable.FlatHashTable$NullSentinel$", {
  scm_FlatHashTable$NullSentinel$: 1,
  O: 1
});
$c_scm_FlatHashTable$NullSentinel$.prototype.$classData = $d_scm_FlatHashTable$NullSentinel$;
var $n_scm_FlatHashTable$NullSentinel$ = (void 0);
function $m_scm_FlatHashTable$NullSentinel$() {
  if ((!$n_scm_FlatHashTable$NullSentinel$)) {
    $n_scm_FlatHashTable$NullSentinel$ = new $c_scm_FlatHashTable$NullSentinel$().init___()
  };
  return $n_scm_FlatHashTable$NullSentinel$
}
/** @constructor */
function $c_scm_HashTable$() {
  $c_O.call(this)
}
$c_scm_HashTable$.prototype = new $h_O();
$c_scm_HashTable$.prototype.constructor = $c_scm_HashTable$;
/** @constructor */
function $h_scm_HashTable$() {
  /*<skip>*/
}
$h_scm_HashTable$.prototype = $c_scm_HashTable$.prototype;
$c_scm_HashTable$.prototype.init___ = (function() {
  return this
});
$c_scm_HashTable$.prototype.capacity__I__I = (function(expectedSize) {
  return ((expectedSize === 0) ? 1 : this.powerOfTwo__I__I(expectedSize))
});
$c_scm_HashTable$.prototype.newThreshold__I__I__I = (function(_loadFactor, size) {
  var hi = (size >> 31);
  var hi$1 = (_loadFactor >> 31);
  var lo = $imul(size, _loadFactor);
  var hi$2 = $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$timesHi__I__I__I__I__I(size, hi, _loadFactor, hi$1);
  var this$1 = $m_sjsr_RuntimeLong$();
  var lo$1 = this$1.divideImpl__I__I__I__I__I(lo, hi$2, 1000, 0);
  return lo$1
});
$c_scm_HashTable$.prototype.powerOfTwo__I__I = (function(target) {
  var c = (((-1) + target) | 0);
  c = (c | ((c >>> 1) | 0));
  c = (c | ((c >>> 2) | 0));
  c = (c | ((c >>> 4) | 0));
  c = (c | ((c >>> 8) | 0));
  c = (c | ((c >>> 16) | 0));
  return ((1 + c) | 0)
});
var $d_scm_HashTable$ = new $TypeData().initClass({
  scm_HashTable$: 0
}, false, "scala.collection.mutable.HashTable$", {
  scm_HashTable$: 1,
  O: 1
});
$c_scm_HashTable$.prototype.$classData = $d_scm_HashTable$;
var $n_scm_HashTable$ = (void 0);
function $m_scm_HashTable$() {
  if ((!$n_scm_HashTable$)) {
    $n_scm_HashTable$ = new $c_scm_HashTable$().init___()
  };
  return $n_scm_HashTable$
}
/** @constructor */
function $c_sjsr_Bits$() {
  $c_O.call(this);
  this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f = false;
  this.arrayBuffer$1 = null;
  this.int32Array$1 = null;
  this.float32Array$1 = null;
  this.float64Array$1 = null;
  this.areTypedArraysBigEndian$1 = false;
  this.highOffset$1 = 0;
  this.lowOffset$1 = 0
}
$c_sjsr_Bits$.prototype = new $h_O();
$c_sjsr_Bits$.prototype.constructor = $c_sjsr_Bits$;
/** @constructor */
function $h_sjsr_Bits$() {
  /*<skip>*/
}
$h_sjsr_Bits$.prototype = $c_sjsr_Bits$.prototype;
$c_sjsr_Bits$.prototype.init___ = (function() {
  $n_sjsr_Bits$ = this;
  var x = ((($g.ArrayBuffer && $g.Int32Array) && $g.Float32Array) && $g.Float64Array);
  this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f = $uZ((!(!x)));
  this.arrayBuffer$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g.ArrayBuffer(8) : null);
  this.int32Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g.Int32Array(this.arrayBuffer$1, 0, 2) : null);
  this.float32Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g.Float32Array(this.arrayBuffer$1, 0, 2) : null);
  this.float64Array$1 = (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f ? new $g.Float64Array(this.arrayBuffer$1, 0, 1) : null);
  if ((!this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f)) {
    var jsx$1 = true
  } else {
    this.int32Array$1[0] = 16909060;
    var jsx$1 = ($uB(new $g.Int8Array(this.arrayBuffer$1, 0, 8)[0]) === 1)
  };
  this.areTypedArraysBigEndian$1 = jsx$1;
  this.highOffset$1 = (this.areTypedArraysBigEndian$1 ? 0 : 1);
  this.lowOffset$1 = (this.areTypedArraysBigEndian$1 ? 1 : 0);
  return this
});
$c_sjsr_Bits$.prototype.numberHashCode__D__I = (function(value) {
  var iv = $uI((value | 0));
  if (((iv === value) && ((1.0 / value) !== (-Infinity)))) {
    return iv
  } else {
    var t = this.doubleToLongBits__D__J(value);
    var lo = t.lo$2;
    var hi = t.hi$2;
    return (lo ^ hi)
  }
});
$c_sjsr_Bits$.prototype.doubleToLongBitsPolyfill__p1__D__J = (function(value) {
  if ((value !== value)) {
    var _3 = $uD($g.Math.pow(2.0, 51));
    var x1_$_$$und1$1 = false;
    var x1_$_$$und2$1 = 2047;
    var x1_$_$$und3$1 = _3
  } else if (((value === Infinity) || (value === (-Infinity)))) {
    var _1 = (value < 0);
    var x1_$_$$und1$1 = _1;
    var x1_$_$$und2$1 = 2047;
    var x1_$_$$und3$1 = 0.0
  } else if ((value === 0.0)) {
    var _1$1 = ((1 / value) === (-Infinity));
    var x1_$_$$und1$1 = _1$1;
    var x1_$_$$und2$1 = 0;
    var x1_$_$$und3$1 = 0.0
  } else {
    var s = (value < 0);
    var av = (s ? (-value) : value);
    if ((av >= $uD($g.Math.pow(2.0, (-1022))))) {
      var twoPowFbits = $uD($g.Math.pow(2.0, 52));
      var a = ($uD($g.Math.log(av)) / 0.6931471805599453);
      var x = $uD($g.Math.floor(a));
      var a$1 = $uI((x | 0));
      var e = ((a$1 < 1023) ? a$1 : 1023);
      var b = e;
      var n = ((av / $uD($g.Math.pow(2.0, b))) * twoPowFbits);
      var w = $uD($g.Math.floor(n));
      var f = (n - w);
      var f$1 = ((f < 0.5) ? w : ((f > 0.5) ? (1 + w) : (((w % 2) !== 0) ? (1 + w) : w)));
      if (((f$1 / twoPowFbits) >= 2)) {
        e = ((1 + e) | 0);
        f$1 = 1.0
      };
      if ((e > 1023)) {
        e = 2047;
        f$1 = 0.0
      } else {
        e = ((1023 + e) | 0);
        f$1 = (f$1 - twoPowFbits)
      };
      var _2 = e;
      var _3$1 = f$1;
      var x1_$_$$und1$1 = s;
      var x1_$_$$und2$1 = _2;
      var x1_$_$$und3$1 = _3$1
    } else {
      var n$1 = (av / $uD($g.Math.pow(2.0, (-1074))));
      var w$1 = $uD($g.Math.floor(n$1));
      var f$2 = (n$1 - w$1);
      var _3$2 = ((f$2 < 0.5) ? w$1 : ((f$2 > 0.5) ? (1 + w$1) : (((w$1 % 2) !== 0) ? (1 + w$1) : w$1)));
      var x1_$_$$und1$1 = s;
      var x1_$_$$und2$1 = 0;
      var x1_$_$$und3$1 = _3$2
    }
  };
  var s$1 = $uZ(x1_$_$$und1$1);
  var e$1 = $uI(x1_$_$$und2$1);
  var f$3 = $uD(x1_$_$$und3$1);
  var x$1 = (f$3 / 4.294967296E9);
  var hif = $uI((x$1 | 0));
  var hi = (((s$1 ? (-2147483648) : 0) | (e$1 << 20)) | hif);
  var lo = $uI((f$3 | 0));
  return new $c_sjsr_RuntimeLong().init___I__I(lo, hi)
});
$c_sjsr_Bits$.prototype.doubleToLongBits__D__J = (function(value) {
  if (this.scala$scalajs$runtime$Bits$$$undareTypedArraysSupported$f) {
    this.float64Array$1[0] = value;
    var value$1 = $uI(this.int32Array$1[this.highOffset$1]);
    var value$2 = $uI(this.int32Array$1[this.lowOffset$1]);
    return new $c_sjsr_RuntimeLong().init___I__I(value$2, value$1)
  } else {
    return this.doubleToLongBitsPolyfill__p1__D__J(value)
  }
});
var $d_sjsr_Bits$ = new $TypeData().initClass({
  sjsr_Bits$: 0
}, false, "scala.scalajs.runtime.Bits$", {
  sjsr_Bits$: 1,
  O: 1
});
$c_sjsr_Bits$.prototype.$classData = $d_sjsr_Bits$;
var $n_sjsr_Bits$ = (void 0);
function $m_sjsr_Bits$() {
  if ((!$n_sjsr_Bits$)) {
    $n_sjsr_Bits$ = new $c_sjsr_Bits$().init___()
  };
  return $n_sjsr_Bits$
}
/** @constructor */
function $c_sjsr_RuntimeString$() {
  $c_O.call(this);
  this.CASE$undINSENSITIVE$undORDER$1 = null;
  this.bitmap$0$1 = false
}
$c_sjsr_RuntimeString$.prototype = new $h_O();
$c_sjsr_RuntimeString$.prototype.constructor = $c_sjsr_RuntimeString$;
/** @constructor */
function $h_sjsr_RuntimeString$() {
  /*<skip>*/
}
$h_sjsr_RuntimeString$.prototype = $c_sjsr_RuntimeString$.prototype;
$c_sjsr_RuntimeString$.prototype.endsWith__T__T__Z = (function(thiz, suffix) {
  return ($as_T(thiz.substring((($uI(thiz.length) - $uI(suffix.length)) | 0))) === suffix)
});
$c_sjsr_RuntimeString$.prototype.init___ = (function() {
  return this
});
$c_sjsr_RuntimeString$.prototype.indexOf__T__I__I__I = (function(thiz, ch, fromIndex) {
  var str = this.fromCodePoint__p1__I__T(ch);
  return $uI(thiz.indexOf(str, fromIndex))
});
$c_sjsr_RuntimeString$.prototype.valueOf__O__T = (function(value) {
  return ((value === null) ? "null" : $objectToString(value))
});
$c_sjsr_RuntimeString$.prototype.lastIndexOf__T__I__I = (function(thiz, ch) {
  var str = this.fromCodePoint__p1__I__T(ch);
  return $uI(thiz.lastIndexOf(str))
});
$c_sjsr_RuntimeString$.prototype.indexOf__T__I__I = (function(thiz, ch) {
  var str = this.fromCodePoint__p1__I__T(ch);
  return $uI(thiz.indexOf(str))
});
$c_sjsr_RuntimeString$.prototype.fromCodePoint__p1__I__T = (function(codePoint) {
  if ((((-65536) & codePoint) === 0)) {
    var array = [codePoint];
    var jsx$2 = $g.String;
    var jsx$1 = jsx$2.fromCharCode.apply(jsx$2, array);
    return $as_T(jsx$1)
  } else if (((codePoint < 0) || (codePoint > 1114111))) {
    throw new $c_jl_IllegalArgumentException().init___()
  } else {
    var offsetCp = (((-65536) + codePoint) | 0);
    var array$1 = [(55296 | (offsetCp >> 10)), (56320 | (1023 & offsetCp))];
    var jsx$4 = $g.String;
    var jsx$3 = jsx$4.fromCharCode.apply(jsx$4, array$1);
    return $as_T(jsx$3)
  }
});
$c_sjsr_RuntimeString$.prototype.hashCode__T__I = (function(thiz) {
  var res = 0;
  var mul = 1;
  var i = (((-1) + $uI(thiz.length)) | 0);
  while ((i >= 0)) {
    var jsx$1 = res;
    var index = i;
    res = ((jsx$1 + $imul((65535 & $uI(thiz.charCodeAt(index))), mul)) | 0);
    mul = $imul(31, mul);
    i = (((-1) + i) | 0)
  };
  return res
});
var $d_sjsr_RuntimeString$ = new $TypeData().initClass({
  sjsr_RuntimeString$: 0
}, false, "scala.scalajs.runtime.RuntimeString$", {
  sjsr_RuntimeString$: 1,
  O: 1
});
$c_sjsr_RuntimeString$.prototype.$classData = $d_sjsr_RuntimeString$;
var $n_sjsr_RuntimeString$ = (void 0);
function $m_sjsr_RuntimeString$() {
  if ((!$n_sjsr_RuntimeString$)) {
    $n_sjsr_RuntimeString$ = new $c_sjsr_RuntimeString$().init___()
  };
  return $n_sjsr_RuntimeString$
}
/** @constructor */
function $c_sjsr_package$() {
  $c_O.call(this)
}
$c_sjsr_package$.prototype = new $h_O();
$c_sjsr_package$.prototype.constructor = $c_sjsr_package$;
/** @constructor */
function $h_sjsr_package$() {
  /*<skip>*/
}
$h_sjsr_package$.prototype = $c_sjsr_package$.prototype;
$c_sjsr_package$.prototype.init___ = (function() {
  return this
});
$c_sjsr_package$.prototype.unwrapJavaScriptException__jl_Throwable__O = (function(th) {
  if ($is_sjs_js_JavaScriptException(th)) {
    var x2 = $as_sjs_js_JavaScriptException(th);
    var e = x2.exception$4;
    return e
  } else {
    return th
  }
});
$c_sjsr_package$.prototype.wrapJavaScriptException__O__jl_Throwable = (function(e) {
  if ($is_jl_Throwable(e)) {
    var x2 = $as_jl_Throwable(e);
    return x2
  } else {
    return new $c_sjs_js_JavaScriptException().init___O(e)
  }
});
var $d_sjsr_package$ = new $TypeData().initClass({
  sjsr_package$: 0
}, false, "scala.scalajs.runtime.package$", {
  sjsr_package$: 1,
  O: 1
});
$c_sjsr_package$.prototype.$classData = $d_sjsr_package$;
var $n_sjsr_package$ = (void 0);
function $m_sjsr_package$() {
  if ((!$n_sjsr_package$)) {
    $n_sjsr_package$ = new $c_sjsr_package$().init___()
  };
  return $n_sjsr_package$
}
/** @constructor */
function $c_sr_BoxesRunTime$() {
  $c_O.call(this)
}
$c_sr_BoxesRunTime$.prototype = new $h_O();
$c_sr_BoxesRunTime$.prototype.constructor = $c_sr_BoxesRunTime$;
/** @constructor */
function $h_sr_BoxesRunTime$() {
  /*<skip>*/
}
$h_sr_BoxesRunTime$.prototype = $c_sr_BoxesRunTime$.prototype;
$c_sr_BoxesRunTime$.prototype.init___ = (function() {
  return this
});
$c_sr_BoxesRunTime$.prototype.equalsCharObject__jl_Character__O__Z = (function(xc, y) {
  if ($is_jl_Character(y)) {
    var x2 = $as_jl_Character(y);
    return (xc.value$1 === x2.value$1)
  } else if ($is_jl_Number(y)) {
    var x3 = $as_jl_Number(y);
    if (((typeof x3) === "number")) {
      var x2$1 = $uD(x3);
      return (x2$1 === xc.value$1)
    } else if ($is_sjsr_RuntimeLong(x3)) {
      var t = $uJ(x3);
      var lo = t.lo$2;
      var hi = t.hi$2;
      var value = xc.value$1;
      var hi$1 = (value >> 31);
      return ((lo === value) && (hi === hi$1))
    } else {
      return ((x3 === null) ? (xc === null) : $objectEquals(x3, xc))
    }
  } else {
    return ((xc === null) && (y === null))
  }
});
$c_sr_BoxesRunTime$.prototype.equalsNumObject__jl_Number__O__Z = (function(xn, y) {
  if ($is_jl_Number(y)) {
    var x2 = $as_jl_Number(y);
    return this.equalsNumNum__jl_Number__jl_Number__Z(xn, x2)
  } else if ($is_jl_Character(y)) {
    var x3 = $as_jl_Character(y);
    if (((typeof xn) === "number")) {
      var x2$1 = $uD(xn);
      return (x2$1 === x3.value$1)
    } else if ($is_sjsr_RuntimeLong(xn)) {
      var t = $uJ(xn);
      var lo = t.lo$2;
      var hi = t.hi$2;
      var value = x3.value$1;
      var hi$1 = (value >> 31);
      return ((lo === value) && (hi === hi$1))
    } else {
      return ((xn === null) ? (x3 === null) : $objectEquals(xn, x3))
    }
  } else {
    return ((xn === null) ? (y === null) : $objectEquals(xn, y))
  }
});
$c_sr_BoxesRunTime$.prototype.equals__O__O__Z = (function(x, y) {
  if ((x === y)) {
    return true
  } else if ($is_jl_Number(x)) {
    var x2 = $as_jl_Number(x);
    return this.equalsNumObject__jl_Number__O__Z(x2, y)
  } else if ($is_jl_Character(x)) {
    var x3 = $as_jl_Character(x);
    return this.equalsCharObject__jl_Character__O__Z(x3, y)
  } else {
    return ((x === null) ? (y === null) : $objectEquals(x, y))
  }
});
$c_sr_BoxesRunTime$.prototype.equalsNumNum__jl_Number__jl_Number__Z = (function(xn, yn) {
  if (((typeof xn) === "number")) {
    var x2 = $uD(xn);
    if (((typeof yn) === "number")) {
      var x2$2 = $uD(yn);
      return (x2 === x2$2)
    } else if ($is_sjsr_RuntimeLong(yn)) {
      var t = $uJ(yn);
      var lo = t.lo$2;
      var hi = t.hi$2;
      return (x2 === $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(lo, hi))
    } else if ($is_s_math_ScalaNumber(yn)) {
      var x4 = $as_s_math_ScalaNumber(yn);
      return x4.equals__O__Z(x2)
    } else {
      return false
    }
  } else if ($is_sjsr_RuntimeLong(xn)) {
    var t$1 = $uJ(xn);
    var lo$1 = t$1.lo$2;
    var hi$1 = t$1.hi$2;
    if ($is_sjsr_RuntimeLong(yn)) {
      var t$2 = $uJ(yn);
      var lo$2 = t$2.lo$2;
      var hi$2 = t$2.hi$2;
      return ((lo$1 === lo$2) && (hi$1 === hi$2))
    } else if (((typeof yn) === "number")) {
      var x3$3 = $uD(yn);
      return ($m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(lo$1, hi$1) === x3$3)
    } else if ($is_s_math_ScalaNumber(yn)) {
      var x4$2 = $as_s_math_ScalaNumber(yn);
      return x4$2.equals__O__Z(new $c_sjsr_RuntimeLong().init___I__I(lo$1, hi$1))
    } else {
      return false
    }
  } else {
    return ((xn === null) ? (yn === null) : $objectEquals(xn, yn))
  }
});
var $d_sr_BoxesRunTime$ = new $TypeData().initClass({
  sr_BoxesRunTime$: 0
}, false, "scala.runtime.BoxesRunTime$", {
  sr_BoxesRunTime$: 1,
  O: 1
});
$c_sr_BoxesRunTime$.prototype.$classData = $d_sr_BoxesRunTime$;
var $n_sr_BoxesRunTime$ = (void 0);
function $m_sr_BoxesRunTime$() {
  if ((!$n_sr_BoxesRunTime$)) {
    $n_sr_BoxesRunTime$ = new $c_sr_BoxesRunTime$().init___()
  };
  return $n_sr_BoxesRunTime$
}
var $d_sr_Null$ = new $TypeData().initClass({
  sr_Null$: 0
}, false, "scala.runtime.Null$", {
  sr_Null$: 1,
  O: 1
});
/** @constructor */
function $c_sr_ScalaRunTime$() {
  $c_O.call(this)
}
$c_sr_ScalaRunTime$.prototype = new $h_O();
$c_sr_ScalaRunTime$.prototype.constructor = $c_sr_ScalaRunTime$;
/** @constructor */
function $h_sr_ScalaRunTime$() {
  /*<skip>*/
}
$h_sr_ScalaRunTime$.prototype = $c_sr_ScalaRunTime$.prototype;
$c_sr_ScalaRunTime$.prototype.init___ = (function() {
  return this
});
$c_sr_ScalaRunTime$.prototype.array$undlength__O__I = (function(xs) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    return x2.u.length
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    return x3.u.length
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    return x4.u.length
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    return x5.u.length
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    return x6.u.length
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    return x7.u.length
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    return x8.u.length
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    return x9.u.length
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    return x10.u.length
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    return x11.u.length
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
$c_sr_ScalaRunTime$.prototype.hash__O__I = (function(x) {
  if ((x === null)) {
    return 0
  } else if ($is_jl_Number(x)) {
    var n = $as_jl_Number(x);
    if (((typeof n) === "number")) {
      var x2 = $uD(n);
      return $m_sr_Statics$().doubleHash__D__I(x2)
    } else if ($is_sjsr_RuntimeLong(n)) {
      var t = $uJ(n);
      var lo = t.lo$2;
      var hi = t.hi$2;
      return $m_sr_Statics$().longHash__J__I(new $c_sjsr_RuntimeLong().init___I__I(lo, hi))
    } else {
      return $objectHashCode(n)
    }
  } else {
    return $objectHashCode(x)
  }
});
$c_sr_ScalaRunTime$.prototype.array$undupdate__O__I__O__V = (function(xs, idx, value) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    x2.u[idx] = value
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    x3.u[idx] = $uI(value)
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    x4.u[idx] = $uD(value)
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    x5.u[idx] = $uJ(value)
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    x6.u[idx] = $uF(value)
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    if ((value === null)) {
      var jsx$1 = 0
    } else {
      var this$2 = $as_jl_Character(value);
      var jsx$1 = this$2.value$1
    };
    x7.u[idx] = jsx$1
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    x8.u[idx] = $uB(value)
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    x9.u[idx] = $uS(value)
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    x10.u[idx] = $uZ(value)
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    x11.u[idx] = $asUnit(value)
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
$c_sr_ScalaRunTime$.prototype.$$undtoString__s_Product__T = (function(x) {
  var this$1 = x.productIterator__sc_Iterator();
  var start = (x.productPrefix__T() + "(");
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this$1, start, ",", ")")
});
$c_sr_ScalaRunTime$.prototype.array$undapply__O__I__O = (function(xs, idx) {
  if ($isArrayOf_O(xs, 1)) {
    var x2 = $asArrayOf_O(xs, 1);
    return x2.u[idx]
  } else if ($isArrayOf_I(xs, 1)) {
    var x3 = $asArrayOf_I(xs, 1);
    return x3.u[idx]
  } else if ($isArrayOf_D(xs, 1)) {
    var x4 = $asArrayOf_D(xs, 1);
    return x4.u[idx]
  } else if ($isArrayOf_J(xs, 1)) {
    var x5 = $asArrayOf_J(xs, 1);
    return x5.u[idx]
  } else if ($isArrayOf_F(xs, 1)) {
    var x6 = $asArrayOf_F(xs, 1);
    return x6.u[idx]
  } else if ($isArrayOf_C(xs, 1)) {
    var x7 = $asArrayOf_C(xs, 1);
    var c = x7.u[idx];
    return new $c_jl_Character().init___C(c)
  } else if ($isArrayOf_B(xs, 1)) {
    var x8 = $asArrayOf_B(xs, 1);
    return x8.u[idx]
  } else if ($isArrayOf_S(xs, 1)) {
    var x9 = $asArrayOf_S(xs, 1);
    return x9.u[idx]
  } else if ($isArrayOf_Z(xs, 1)) {
    var x10 = $asArrayOf_Z(xs, 1);
    return x10.u[idx]
  } else if ($isArrayOf_sr_BoxedUnit(xs, 1)) {
    var x11 = $asArrayOf_sr_BoxedUnit(xs, 1);
    return x11.u[idx]
  } else if ((xs === null)) {
    throw new $c_jl_NullPointerException().init___()
  } else {
    throw new $c_s_MatchError().init___O(xs)
  }
});
var $d_sr_ScalaRunTime$ = new $TypeData().initClass({
  sr_ScalaRunTime$: 0
}, false, "scala.runtime.ScalaRunTime$", {
  sr_ScalaRunTime$: 1,
  O: 1
});
$c_sr_ScalaRunTime$.prototype.$classData = $d_sr_ScalaRunTime$;
var $n_sr_ScalaRunTime$ = (void 0);
function $m_sr_ScalaRunTime$() {
  if ((!$n_sr_ScalaRunTime$)) {
    $n_sr_ScalaRunTime$ = new $c_sr_ScalaRunTime$().init___()
  };
  return $n_sr_ScalaRunTime$
}
/** @constructor */
function $c_sr_Statics$() {
  $c_O.call(this)
}
$c_sr_Statics$.prototype = new $h_O();
$c_sr_Statics$.prototype.constructor = $c_sr_Statics$;
/** @constructor */
function $h_sr_Statics$() {
  /*<skip>*/
}
$h_sr_Statics$.prototype = $c_sr_Statics$.prototype;
$c_sr_Statics$.prototype.init___ = (function() {
  return this
});
$c_sr_Statics$.prototype.mixLast__I__I__I = (function(hash, data) {
  var k = data;
  k = $imul((-862048943), k);
  var i = k;
  k = ((i << 15) | ((i >>> 17) | 0));
  k = $imul(461845907, k);
  return (hash ^ k)
});
$c_sr_Statics$.prototype.doubleHash__D__I = (function(dv) {
  var iv = $doubleToInt(dv);
  if ((iv === dv)) {
    return iv
  } else {
    var this$1 = $m_sjsr_RuntimeLong$();
    var lo = this$1.scala$scalajs$runtime$RuntimeLong$$fromDoubleImpl__D__I(dv);
    var hi = this$1.scala$scalajs$runtime$RuntimeLong$$hiReturn$f;
    return (($m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(lo, hi) === dv) ? (lo ^ hi) : $m_sjsr_Bits$().numberHashCode__D__I(dv))
  }
});
$c_sr_Statics$.prototype.avalanche__I__I = (function(h0) {
  var h = h0;
  h = (h ^ ((h >>> 16) | 0));
  h = $imul((-2048144789), h);
  h = (h ^ ((h >>> 13) | 0));
  h = $imul((-1028477387), h);
  h = (h ^ ((h >>> 16) | 0));
  return h
});
$c_sr_Statics$.prototype.mix__I__I__I = (function(hash, data) {
  var h = this.mixLast__I__I__I(hash, data);
  var i = h;
  h = ((i << 13) | ((i >>> 19) | 0));
  return (((-430675100) + $imul(5, h)) | 0)
});
$c_sr_Statics$.prototype.longHash__J__I = (function(lv) {
  var lo = lv.lo$2;
  var lo$1 = lv.hi$2;
  return ((lo$1 === (lo >> 31)) ? lo : (lo ^ lo$1))
});
$c_sr_Statics$.prototype.finalizeHash__I__I__I = (function(hash, length) {
  return this.avalanche__I__I((hash ^ length))
});
var $d_sr_Statics$ = new $TypeData().initClass({
  sr_Statics$: 0
}, false, "scala.runtime.Statics$", {
  sr_Statics$: 1,
  O: 1
});
$c_sr_Statics$.prototype.$classData = $d_sr_Statics$;
var $n_sr_Statics$ = (void 0);
function $m_sr_Statics$() {
  if ((!$n_sr_Statics$)) {
    $n_sr_Statics$ = new $c_sr_Statics$().init___()
  };
  return $n_sr_Statics$
}
/** @constructor */
function $c_Lcom_badlogic_gdx_Game() {
  $c_O.call(this);
  this.screen$1 = null
}
$c_Lcom_badlogic_gdx_Game.prototype = new $h_O();
$c_Lcom_badlogic_gdx_Game.prototype.constructor = $c_Lcom_badlogic_gdx_Game;
/** @constructor */
function $h_Lcom_badlogic_gdx_Game() {
  /*<skip>*/
}
$h_Lcom_badlogic_gdx_Game.prototype = $c_Lcom_badlogic_gdx_Game.prototype;
$c_Lcom_badlogic_gdx_Game.prototype.init___ = (function() {
  this.screen$1 = null;
  return this
});
$c_Lcom_badlogic_gdx_Game.prototype.setScreen__Lcom_badlogic_gdx_Screen__V = (function(screen) {
  this.screen$1 = screen;
  if ((this.screen$1 !== null)) {
    var this$1 = this.screen$1;
    var width = $uI($g.gdx.Gdx.graphics.getWidth());
    var height = $uI($g.gdx.Gdx.graphics.getHeight());
    this$1.spriteRenderSystem__Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem().resize__I__I__V(width, height)
  }
});
$c_Lcom_badlogic_gdx_Game.prototype.pause__V = (function() {
  /*<skip>*/
});
$c_Lcom_badlogic_gdx_Game.prototype.$$js$exported$meth$dispose__O = (function() {
  this.dispose__V()
});
$c_Lcom_badlogic_gdx_Game.prototype.resize__I__I__V = (function(width, height) {
  if ((this.screen$1 !== null)) {
    var this$1 = this.screen$1;
    this$1.spriteRenderSystem__Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem().resize__I__I__V(width, height)
  }
});
$c_Lcom_badlogic_gdx_Game.prototype.$$js$exported$meth$resize__I__I__O = (function(width, height) {
  this.resize__I__I__V(width, height)
});
$c_Lcom_badlogic_gdx_Game.prototype.$$js$exported$meth$create__O = (function() {
  this.playGame__V()
});
$c_Lcom_badlogic_gdx_Game.prototype.$$js$exported$meth$render__O = (function() {
  this.render__V()
});
$c_Lcom_badlogic_gdx_Game.prototype.render__V = (function() {
  if ((this.screen$1 !== null)) {
    var this$1 = this.screen$1;
    $uF($g.gdx.Gdx.graphics.getDeltaTime());
    this$1.systems__Lcom_darkoverlordofdata_entitas_Systems().execute__V()
  }
});
$c_Lcom_badlogic_gdx_Game.prototype.dispose__V = (function() {
  /*<skip>*/
});
$c_Lcom_badlogic_gdx_Game.prototype.$$js$exported$meth$resume__O = (function() {
  this.resume__V()
});
$c_Lcom_badlogic_gdx_Game.prototype.resume__V = (function() {
  /*<skip>*/
});
$c_Lcom_badlogic_gdx_Game.prototype.$$js$exported$meth$pause__O = (function() {
  this.pause__V()
});
$c_Lcom_badlogic_gdx_Game.prototype.dispose = (function() {
  return this.$$js$exported$meth$dispose__O()
});
$c_Lcom_badlogic_gdx_Game.prototype.resume = (function() {
  return this.$$js$exported$meth$resume__O()
});
$c_Lcom_badlogic_gdx_Game.prototype.pause = (function() {
  return this.$$js$exported$meth$pause__O()
});
$c_Lcom_badlogic_gdx_Game.prototype.render = (function() {
  return this.$$js$exported$meth$render__O()
});
$c_Lcom_badlogic_gdx_Game.prototype.resize = (function(arg$1, arg$2) {
  var prep0 = $uI(arg$1);
  var prep1 = $uI(arg$2);
  return this.$$js$exported$meth$resize__I__I__O(prep0, prep1)
});
$c_Lcom_badlogic_gdx_Game.prototype.create = (function() {
  return this.$$js$exported$meth$create__O()
});
/** @constructor */
function $c_Lcom_badlogic_gdx_InputAdapter() {
  $c_O.call(this)
}
$c_Lcom_badlogic_gdx_InputAdapter.prototype = new $h_O();
$c_Lcom_badlogic_gdx_InputAdapter.prototype.constructor = $c_Lcom_badlogic_gdx_InputAdapter;
/** @constructor */
function $h_Lcom_badlogic_gdx_InputAdapter() {
  /*<skip>*/
}
$h_Lcom_badlogic_gdx_InputAdapter.prototype = $c_Lcom_badlogic_gdx_InputAdapter.prototype;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_BrowserLauncher$() {
  $c_O.call(this)
}
$c_Lcom_darkoverlordofdata_demo_BrowserLauncher$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_BrowserLauncher$.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_BrowserLauncher$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_BrowserLauncher$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_BrowserLauncher$.prototype = $c_Lcom_darkoverlordofdata_demo_BrowserLauncher$.prototype;
$c_Lcom_darkoverlordofdata_demo_BrowserLauncher$.prototype.init___ = (function() {
  return this
});
$c_Lcom_darkoverlordofdata_demo_BrowserLauncher$.prototype.main__V = (function() {
  var config = new $g.gdx.JsApplicationConfiguration();
  config.width = 320.0;
  config.height = 480.0;
  new $g.gdx.JsApplication(new $c_Lcom_darkoverlordofdata_demo_Demo().init___(), config)
});
$c_Lcom_darkoverlordofdata_demo_BrowserLauncher$.prototype.$$js$exported$meth$main__O = (function() {
  this.main__V()
});
$c_Lcom_darkoverlordofdata_demo_BrowserLauncher$.prototype.main = (function() {
  return this.$$js$exported$meth$main__O()
});
var $d_Lcom_darkoverlordofdata_demo_BrowserLauncher$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_BrowserLauncher$: 0
}, false, "com.darkoverlordofdata.demo.BrowserLauncher$", {
  Lcom_darkoverlordofdata_demo_BrowserLauncher$: 1,
  O: 1,
  sjs_js_JSApp: 1
});
$c_Lcom_darkoverlordofdata_demo_BrowserLauncher$.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_BrowserLauncher$;
var $n_Lcom_darkoverlordofdata_demo_BrowserLauncher$ = (void 0);
function $m_Lcom_darkoverlordofdata_demo_BrowserLauncher$() {
  if ((!$n_Lcom_darkoverlordofdata_demo_BrowserLauncher$)) {
    $n_Lcom_darkoverlordofdata_demo_BrowserLauncher$ = new $c_Lcom_darkoverlordofdata_demo_BrowserLauncher$().init___()
  };
  return $n_Lcom_darkoverlordofdata_demo_BrowserLauncher$
}
$e.com = ($e.com || {});
$e.com.darkoverlordofdata = ($e.com.darkoverlordofdata || {});
$e.com.darkoverlordofdata.demo = ($e.com.darkoverlordofdata.demo || {});
$e.com.darkoverlordofdata.demo.BrowserLauncher = $m_Lcom_darkoverlordofdata_demo_BrowserLauncher$;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_GameScene() {
  $c_O.call(this);
  this.width$1 = 0;
  this.height$1 = 0;
  this.pixelFactor$1 = 0;
  this.camera$1 = null;
  this.pool$1 = null;
  this.spriteRenderSystem$1 = null;
  this.systems$1 = null;
  this.bitmap$0$1 = 0
}
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_GameScene;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_GameScene() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_GameScene.prototype = $c_Lcom_darkoverlordofdata_demo_GameScene.prototype;
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.init___ = (function() {
  this.systems__Lcom_darkoverlordofdata_entitas_Systems().initialize__V();
  return this
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.spriteRenderSystem$lzycompute__p1__Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem = (function() {
  if (((32 & this.bitmap$0$1) === 0)) {
    this.spriteRenderSystem$1 = new $c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, this.pool__Lcom_darkoverlordofdata_entitas_Pool());
    this.bitmap$0$1 = (32 | this.bitmap$0$1)
  };
  return this.spriteRenderSystem$1
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.width__I = (function() {
  return (((1 & this.bitmap$0$1) === 0) ? this.width$lzycompute__p1__I() : this.width$1)
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.height$lzycompute__p1__I = (function() {
  if (((2 & this.bitmap$0$1) === 0)) {
    this.height$1 = $uI($g.gdx.Gdx.graphics.getHeight());
    this.bitmap$0$1 = (2 | this.bitmap$0$1)
  };
  return this.height$1
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.pool$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Pool = (function() {
  if (((16 & this.bitmap$0$1) === 0)) {
    this.pool$1 = new $c_Lcom_darkoverlordofdata_entitas_Pool().init___I__I($m_Lcom_darkoverlordofdata_demo_Component$().TotalComponents$2.i$2, 0);
    this.bitmap$0$1 = (16 | this.bitmap$0$1)
  };
  return this.pool$1
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.height__I = (function() {
  return (((2 & this.bitmap$0$1) === 0) ? this.height$lzycompute__p1__I() : this.height$1)
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.camera__Lcom_badlogic_gdx_graphics_OrthographicCamera = (function() {
  return (((8 & this.bitmap$0$1) === 0) ? this.camera$lzycompute__p1__Lcom_badlogic_gdx_graphics_OrthographicCamera() : this.camera$1)
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.pool__Lcom_darkoverlordofdata_entitas_Pool = (function() {
  return (((16 & this.bitmap$0$1) === 0) ? this.pool$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Pool() : this.pool$1)
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.systems$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Systems = (function() {
  if (((64 & this.bitmap$0$1) === 0)) {
    this.systems$1 = this.createSystems__Lcom_darkoverlordofdata_entitas_Pool__Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem__Lcom_darkoverlordofdata_entitas_Systems(this.pool__Lcom_darkoverlordofdata_entitas_Pool(), this.spriteRenderSystem__Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem());
    this.bitmap$0$1 = (64 | this.bitmap$0$1)
  };
  return this.systems$1
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.width$lzycompute__p1__I = (function() {
  if (((1 & this.bitmap$0$1) === 0)) {
    this.width$1 = $uI($g.gdx.Gdx.graphics.getWidth());
    this.bitmap$0$1 = (1 | this.bitmap$0$1)
  };
  return this.width$1
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.spriteRenderSystem__Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem = (function() {
  return (((32 & this.bitmap$0$1) === 0) ? this.spriteRenderSystem$lzycompute__p1__Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem() : this.spriteRenderSystem$1)
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.systems__Lcom_darkoverlordofdata_entitas_Systems = (function() {
  return (((64 & this.bitmap$0$1) === 0) ? this.systems$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Systems() : this.systems$1)
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.camera$lzycompute__p1__Lcom_badlogic_gdx_graphics_OrthographicCamera = (function() {
  if (((8 & this.bitmap$0$1) === 0)) {
    this.camera$1 = new $g.gdx.graphics.OrthographicCamera($fround(($fround(this.width__I()) / $fround(this.pixelFactor__I()))), $fround(($fround(this.height__I()) / $fround(this.pixelFactor__I()))));
    this.bitmap$0$1 = (8 | this.bitmap$0$1)
  };
  return this.camera$1
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.createSystems__Lcom_darkoverlordofdata_entitas_Pool__Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem__Lcom_darkoverlordofdata_entitas_Systems = (function(pool, spriteRenderSystem) {
  return new $c_Lcom_darkoverlordofdata_entitas_Systems().init___().add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(spriteRenderSystem)).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool))).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool))).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool))).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool))).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool))).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool))).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool))).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool))).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool))).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool))).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool))).add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems(pool.createSystem__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_ISystem(new $c_Lcom_darkoverlordofdata_demo_systems_DestroySystem().init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool(this, pool)))
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.pixelFactor__I = (function() {
  return (((4 & this.bitmap$0$1) === 0) ? this.pixelFactor$lzycompute__p1__I() : this.pixelFactor$1)
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.pixelFactor$lzycompute__p1__I = (function() {
  if (((4 & this.bitmap$0$1) === 0)) {
    this.pixelFactor$1 = (($fround($uI($g.gdx.Gdx.graphics.getDensity())) > 1.0) ? 2 : 1);
    this.bitmap$0$1 = (4 | this.bitmap$0$1)
  };
  return this.pixelFactor$1
});
var $d_Lcom_darkoverlordofdata_demo_GameScene = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_GameScene: 0
}, false, "com.darkoverlordofdata.demo.GameScene", {
  Lcom_darkoverlordofdata_demo_GameScene: 1,
  O: 1,
  Lcom_badlogic_gdx_Screen: 1
});
$c_Lcom_darkoverlordofdata_demo_GameScene.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_GameScene;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null
}
$c_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("ViewManagerSystem\n");
  var this$7 = pool.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().Position$1).onEntityAdded$1;
  var invoker = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(it$2) {
    var it = $as_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(it$2);
    var entity = it.entity$1;
    var sprite = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).view__Lcom_darkoverlordofdata_demo_ViewComponent().sprite$1;
    if ((sprite !== null)) {
      if (($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).hasPosition__Z()) {
        var pos = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).position__Lcom_darkoverlordofdata_demo_PositionComponent();
        sprite.setX(pos.x$1);
        sprite.setY(pos.y$1)
      }
    }
  }));
  this$7.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker);
  var this$11 = pool.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().Tint$1).onEntityAdded$1;
  var invoker$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(it$2$1) {
    var it$1 = $as_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(it$2$1);
    var entity$1 = it$1.entity$1;
    var sprite$1 = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$1)).view__Lcom_darkoverlordofdata_demo_ViewComponent().sprite$1;
    if (($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$1)).hasTint__Z()) {
      var tint = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$1)).tint__Lcom_darkoverlordofdata_demo_TintComponent();
      sprite$1.setColor(tint.r$1, tint.g$1, tint.b$1, tint.a$1)
    }
  }));
  this$11.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker$1);
  var this$13 = pool.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().Tint$1).onEntityRemoved$1;
  var invoker$2 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(it$2$2) {
    var it$3 = $as_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(it$2$2);
    var entity$2 = it$3.entity$1;
    var sprite$2 = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$2)).view__Lcom_darkoverlordofdata_demo_ViewComponent().sprite$1;
    sprite$2.setColor(0.0, 0.0, 0.0, 0.0)
  }));
  this$13.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker$2);
  var this$17 = pool.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().Scale$1).onEntityAdded$1;
  var invoker$3 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(it$2$3) {
    var it$4 = $as_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(it$2$3);
    var entity$3 = it$4.entity$1;
    var sprite$3 = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$3)).view__Lcom_darkoverlordofdata_demo_ViewComponent().sprite$1;
    if (($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$3)).hasScale__Z()) {
      var scale = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity$3)).scale__Lcom_darkoverlordofdata_demo_ScaleComponent();
      sprite$3.setScale(scale.x$1, scale.y$1)
    }
  }));
  this$17.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker$3);
  return this
});
var $d_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.ViewManagerSystem", {
  Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_ViewManagerSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs() {
  $c_O.call(this);
  this.entity$1 = null;
  this.index$1 = 0;
  this.previous$1 = null;
  this.replacement$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs.prototype = $c_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs.prototype;
$c_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs.prototype.init___Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_IComponent = (function(entity, index, previous, replacement) {
  this.entity$1 = entity;
  this.index$1 = index;
  this.previous$1 = previous;
  this.replacement$1 = replacement;
  return this
});
function $is_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs)))
}
function $as_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.ComponentReplacedArgs"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.ComponentReplacedArgs;", depth))
}
var $d_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs: 0
}, false, "com.darkoverlordofdata.entitas.ComponentReplacedArgs", {
  Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_EventArgs: 1
});
$c_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_EntityChangedArgs() {
  $c_O.call(this);
  this.entity$1 = null;
  this.index$1 = 0;
  this.component$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_EntityChangedArgs.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_EntityChangedArgs.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_EntityChangedArgs;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_EntityChangedArgs() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_EntityChangedArgs.prototype = $c_Lcom_darkoverlordofdata_entitas_EntityChangedArgs.prototype;
$c_Lcom_darkoverlordofdata_entitas_EntityChangedArgs.prototype.init___Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent = (function(entity, index, component) {
  this.entity$1 = entity;
  this.index$1 = index;
  this.component$1 = component;
  return this
});
function $is_Lcom_darkoverlordofdata_entitas_EntityChangedArgs(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_EntityChangedArgs)))
}
function $as_Lcom_darkoverlordofdata_entitas_EntityChangedArgs(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_EntityChangedArgs(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.EntityChangedArgs"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_EntityChangedArgs(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_EntityChangedArgs)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_EntityChangedArgs(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_EntityChangedArgs(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.EntityChangedArgs;", depth))
}
var $d_Lcom_darkoverlordofdata_entitas_EntityChangedArgs = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_EntityChangedArgs: 0
}, false, "com.darkoverlordofdata.entitas.EntityChangedArgs", {
  Lcom_darkoverlordofdata_entitas_EntityChangedArgs: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_EventArgs: 1
});
$c_Lcom_darkoverlordofdata_entitas_EntityChangedArgs.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_EntityChangedArgs;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs() {
  $c_O.call(this);
  this.entity$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs.prototype = $c_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs.prototype;
$c_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs.prototype.init___Lcom_darkoverlordofdata_entitas_Entity = (function(entity) {
  this.entity$1 = entity;
  return this
});
function $is_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_EntityReleasedArgs)))
}
function $as_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.EntityReleasedArgs"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_EntityReleasedArgs)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.EntityReleasedArgs;", depth))
}
var $d_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_EntityReleasedArgs: 0
}, false, "com.darkoverlordofdata.entitas.EntityReleasedArgs", {
  Lcom_darkoverlordofdata_entitas_EntityReleasedArgs: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_EventArgs: 1
});
$c_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_EntityReleasedArgs;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_GroupChangedArgs() {
  $c_O.call(this);
  this.group$1 = null;
  this.entity$1 = null;
  this.index$1 = 0;
  this.newComponent$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_GroupChangedArgs.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_GroupChangedArgs.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_GroupChangedArgs;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_GroupChangedArgs() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_GroupChangedArgs.prototype = $c_Lcom_darkoverlordofdata_entitas_GroupChangedArgs.prototype;
$c_Lcom_darkoverlordofdata_entitas_GroupChangedArgs.prototype.init___Lcom_darkoverlordofdata_entitas_Group__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent = (function(group, entity, index, newComponent) {
  this.group$1 = group;
  this.entity$1 = entity;
  this.index$1 = index;
  this.newComponent$1 = newComponent;
  return this
});
function $is_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_GroupChangedArgs)))
}
function $as_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.GroupChangedArgs"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_GroupChangedArgs)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.GroupChangedArgs;", depth))
}
var $d_Lcom_darkoverlordofdata_entitas_GroupChangedArgs = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_GroupChangedArgs: 0
}, false, "com.darkoverlordofdata.entitas.GroupChangedArgs", {
  Lcom_darkoverlordofdata_entitas_GroupChangedArgs: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_EventArgs: 1
});
$c_Lcom_darkoverlordofdata_entitas_GroupChangedArgs.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_GroupChangedArgs;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs() {
  $c_O.call(this);
  this.group$1 = null;
  this.entity$1 = null;
  this.index$1 = 0;
  this.prevComponent$1 = null;
  this.newComponent$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs.prototype = $c_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs.prototype;
$c_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs.prototype.init___Lcom_darkoverlordofdata_entitas_Group__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_IComponent = (function(group, entity, index, prevComponent, newComponent) {
  this.group$1 = group;
  this.entity$1 = entity;
  this.index$1 = index;
  this.prevComponent$1 = prevComponent;
  this.newComponent$1 = newComponent;
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs: 0
}, false, "com.darkoverlordofdata.entitas.GroupUpdatedArgs", {
  Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_EventArgs: 1
});
$c_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_GroupUpdatedArgs;
function $is_Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem)))
}
function $as_Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.IMultiReactiveSystem"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.IMultiReactiveSystem;", depth))
}
function $is_Lcom_darkoverlordofdata_entitas_IReactiveSystem(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_IReactiveSystem)))
}
function $as_Lcom_darkoverlordofdata_entitas_IReactiveSystem(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_IReactiveSystem(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.IReactiveSystem"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_IReactiveSystem(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_IReactiveSystem)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_IReactiveSystem(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_IReactiveSystem(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.IReactiveSystem;", depth))
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs() {
  $c_O.call(this);
  this.pool$1 = null;
  this.entity$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs.prototype = $c_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs.prototype;
$c_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs.prototype.init___Lcom_darkoverlordofdata_entitas_Pool__Lcom_darkoverlordofdata_entitas_Entity = (function(pool, entity) {
  this.pool$1 = pool;
  this.entity$1 = entity;
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs: 0
}, false, "com.darkoverlordofdata.entitas.PoolEntityChangedArgs", {
  Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_EventArgs: 1
});
$c_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_PoolEntityChangedArgs;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs() {
  $c_O.call(this);
  this.pool$1 = null;
  this.group$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs.prototype = $c_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs.prototype;
$c_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs.prototype.init___Lcom_darkoverlordofdata_entitas_Pool__Lcom_darkoverlordofdata_entitas_Group = (function(pool, group) {
  this.pool$1 = pool;
  this.group$1 = group;
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs: 0
}, false, "com.darkoverlordofdata.entitas.PoolGroupChangedArgs", {
  Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_EventArgs: 1
});
$c_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_PoolGroupChangedArgs;
/** @constructor */
function $c_jl_Number() {
  $c_O.call(this)
}
$c_jl_Number.prototype = new $h_O();
$c_jl_Number.prototype.constructor = $c_jl_Number;
/** @constructor */
function $h_jl_Number() {
  /*<skip>*/
}
$h_jl_Number.prototype = $c_jl_Number.prototype;
function $is_jl_Number(obj) {
  return (!(!(((obj && obj.$classData) && obj.$classData.ancestors.jl_Number) || ((typeof obj) === "number"))))
}
function $as_jl_Number(obj) {
  return (($is_jl_Number(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Number"))
}
function $isArrayOf_jl_Number(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Number)))
}
function $asArrayOf_jl_Number(obj, depth) {
  return (($isArrayOf_jl_Number(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Number;", depth))
}
/** @constructor */
function $c_jl_Throwable() {
  $c_O.call(this);
  this.s$1 = null;
  this.e$1 = null;
  this.stackTrace$1 = null
}
$c_jl_Throwable.prototype = new $h_O();
$c_jl_Throwable.prototype.constructor = $c_jl_Throwable;
/** @constructor */
function $h_jl_Throwable() {
  /*<skip>*/
}
$h_jl_Throwable.prototype = $c_jl_Throwable.prototype;
$c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable = (function() {
  var v = $g.Error.captureStackTrace;
  if ((v === (void 0))) {
    try {
      var e$1 = {}.undef()
    } catch (e) {
      var e$2 = $m_sjsr_package$().wrapJavaScriptException__O__jl_Throwable(e);
      if ((e$2 !== null)) {
        if ($is_sjs_js_JavaScriptException(e$2)) {
          var x5 = $as_sjs_js_JavaScriptException(e$2);
          var e$3 = x5.exception$4;
          var e$1 = e$3
        } else {
          var e$1;
          throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(e$2)
        }
      } else {
        var e$1;
        throw e
      }
    };
    this.stackdata = e$1
  } else {
    $g.Error.captureStackTrace(this);
    this.stackdata = this
  };
  return this
});
$c_jl_Throwable.prototype.getMessage__T = (function() {
  return this.s$1
});
$c_jl_Throwable.prototype.toString__T = (function() {
  var className = $objectGetClass(this).getName__T();
  var message = this.getMessage__T();
  return ((message === null) ? className : ((className + ": ") + message))
});
$c_jl_Throwable.prototype.init___T__jl_Throwable = (function(s, e) {
  this.s$1 = s;
  this.e$1 = e;
  this.fillInStackTrace__jl_Throwable();
  return this
});
function $is_jl_Throwable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_Throwable)))
}
function $as_jl_Throwable(obj) {
  return (($is_jl_Throwable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Throwable"))
}
function $isArrayOf_jl_Throwable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Throwable)))
}
function $asArrayOf_jl_Throwable(obj, depth) {
  return (($isArrayOf_jl_Throwable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Throwable;", depth))
}
/** @constructor */
function $c_ju_Random() {
  $c_O.call(this);
  this.seedHi$1 = 0;
  this.seedLo$1 = 0;
  this.nextNextGaussian$1 = 0.0;
  this.haveNextNextGaussian$1 = false
}
$c_ju_Random.prototype = new $h_O();
$c_ju_Random.prototype.constructor = $c_ju_Random;
/** @constructor */
function $h_ju_Random() {
  /*<skip>*/
}
$h_ju_Random.prototype = $c_ju_Random.prototype;
$c_ju_Random.prototype.init___ = (function() {
  $c_ju_Random.prototype.init___J.call(this, $m_ju_Random$().java$util$Random$$randomSeed__J());
  return this
});
$c_ju_Random.prototype.init___J = (function(seed_in) {
  this.haveNextNextGaussian$1 = false;
  this.setSeed__J__V(seed_in);
  return this
});
$c_ju_Random.prototype.next__I__I = (function(bits) {
  var oldSeedHi = this.seedHi$1;
  var oldSeedLo = this.seedLo$1;
  var loProd = (11 + (15525485 * oldSeedLo));
  var hiProd = ((1502 * oldSeedLo) + (15525485 * oldSeedHi));
  var x = (loProd / 16777216);
  var newSeedHi = (16777215 & (($uI((x | 0)) + (16777215 & $uI((hiProd | 0)))) | 0));
  var newSeedLo = (16777215 & $uI((loProd | 0)));
  this.seedHi$1 = newSeedHi;
  this.seedLo$1 = newSeedLo;
  var result32 = ((newSeedHi << 8) | (newSeedLo >> 16));
  return ((result32 >>> ((32 - bits) | 0)) | 0)
});
$c_ju_Random.prototype.nextFloat__F = (function() {
  return $fround((this.next__I__I(24) / 16777216))
});
$c_ju_Random.prototype.setSeed__J__V = (function(seed_in) {
  var lo = ((-554899859) ^ seed_in.lo$2);
  var hi = (5 ^ seed_in.hi$2);
  var hi$1 = (65535 & hi);
  var lo$1 = (((lo >>> 24) | 0) | (hi$1 << 8));
  this.seedHi$1 = lo$1;
  this.seedLo$1 = (16777215 & lo);
  this.haveNextNextGaussian$1 = false
});
var $d_ju_Random = new $TypeData().initClass({
  ju_Random: 0
}, false, "java.util.Random", {
  ju_Random: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_Random.prototype.$classData = $d_ju_Random;
/** @constructor */
function $c_s_Predef$$anon$3() {
  $c_O.call(this)
}
$c_s_Predef$$anon$3.prototype = new $h_O();
$c_s_Predef$$anon$3.prototype.constructor = $c_s_Predef$$anon$3;
/** @constructor */
function $h_s_Predef$$anon$3() {
  /*<skip>*/
}
$h_s_Predef$$anon$3.prototype = $c_s_Predef$$anon$3.prototype;
$c_s_Predef$$anon$3.prototype.init___ = (function() {
  return this
});
$c_s_Predef$$anon$3.prototype.apply__scm_Builder = (function() {
  return new $c_scm_StringBuilder().init___()
});
$c_s_Predef$$anon$3.prototype.apply__O__scm_Builder = (function(from) {
  $as_T(from);
  return new $c_scm_StringBuilder().init___()
});
var $d_s_Predef$$anon$3 = new $TypeData().initClass({
  s_Predef$$anon$3: 0
}, false, "scala.Predef$$anon$3", {
  s_Predef$$anon$3: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_s_Predef$$anon$3.prototype.$classData = $d_s_Predef$$anon$3;
/** @constructor */
function $c_s_package$$anon$1() {
  $c_O.call(this)
}
$c_s_package$$anon$1.prototype = new $h_O();
$c_s_package$$anon$1.prototype.constructor = $c_s_package$$anon$1;
/** @constructor */
function $h_s_package$$anon$1() {
  /*<skip>*/
}
$h_s_package$$anon$1.prototype = $c_s_package$$anon$1.prototype;
$c_s_package$$anon$1.prototype.init___ = (function() {
  return this
});
$c_s_package$$anon$1.prototype.toString__T = (function() {
  return "object AnyRef"
});
var $d_s_package$$anon$1 = new $TypeData().initClass({
  s_package$$anon$1: 0
}, false, "scala.package$$anon$1", {
  s_package$$anon$1: 1,
  O: 1,
  s_Specializable: 1
});
$c_s_package$$anon$1.prototype.$classData = $d_s_package$$anon$1;
/** @constructor */
function $c_s_util_hashing_MurmurHash3$() {
  $c_s_util_hashing_MurmurHash3.call(this);
  this.arraySeed$2 = 0;
  this.stringSeed$2 = 0;
  this.productSeed$2 = 0;
  this.symmetricSeed$2 = 0;
  this.traversableSeed$2 = 0;
  this.seqSeed$2 = 0;
  this.mapSeed$2 = 0;
  this.setSeed$2 = 0
}
$c_s_util_hashing_MurmurHash3$.prototype = new $h_s_util_hashing_MurmurHash3();
$c_s_util_hashing_MurmurHash3$.prototype.constructor = $c_s_util_hashing_MurmurHash3$;
/** @constructor */
function $h_s_util_hashing_MurmurHash3$() {
  /*<skip>*/
}
$h_s_util_hashing_MurmurHash3$.prototype = $c_s_util_hashing_MurmurHash3$.prototype;
$c_s_util_hashing_MurmurHash3$.prototype.init___ = (function() {
  $n_s_util_hashing_MurmurHash3$ = this;
  this.seqSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Seq");
  this.mapSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Map");
  this.setSeed$2 = $m_sjsr_RuntimeString$().hashCode__T__I("Set");
  return this
});
$c_s_util_hashing_MurmurHash3$.prototype.seqHash__sc_Seq__I = (function(xs) {
  if ($is_sci_List(xs)) {
    var x2 = $as_sci_List(xs);
    return this.listHash__sci_List__I__I(x2, this.seqSeed$2)
  } else {
    return this.orderedHash__sc_TraversableOnce__I__I(xs, this.seqSeed$2)
  }
});
var $d_s_util_hashing_MurmurHash3$ = new $TypeData().initClass({
  s_util_hashing_MurmurHash3$: 0
}, false, "scala.util.hashing.MurmurHash3$", {
  s_util_hashing_MurmurHash3$: 1,
  s_util_hashing_MurmurHash3: 1,
  O: 1
});
$c_s_util_hashing_MurmurHash3$.prototype.$classData = $d_s_util_hashing_MurmurHash3$;
var $n_s_util_hashing_MurmurHash3$ = (void 0);
function $m_s_util_hashing_MurmurHash3$() {
  if ((!$n_s_util_hashing_MurmurHash3$)) {
    $n_s_util_hashing_MurmurHash3$ = new $c_s_util_hashing_MurmurHash3$().init___()
  };
  return $n_s_util_hashing_MurmurHash3$
}
/** @constructor */
function $c_sc_TraversableLike$WithFilter() {
  $c_O.call(this);
  this.p$1 = null;
  this.$$outer$f = null
}
$c_sc_TraversableLike$WithFilter.prototype = new $h_O();
$c_sc_TraversableLike$WithFilter.prototype.constructor = $c_sc_TraversableLike$WithFilter;
/** @constructor */
function $h_sc_TraversableLike$WithFilter() {
  /*<skip>*/
}
$h_sc_TraversableLike$WithFilter.prototype = $c_sc_TraversableLike$WithFilter.prototype;
$c_sc_TraversableLike$WithFilter.prototype.foreach__F1__V = (function(f) {
  this.$$outer$f.foreach__F1__V(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this, f$1) {
    return (function(x$2) {
      return ($uZ($this.p$1.apply__O__O(x$2)) ? f$1.apply__O__O(x$2) : (void 0))
    })
  })(this, f)))
});
$c_sc_TraversableLike$WithFilter.prototype.init___sc_TraversableLike__F1 = (function($$outer, p) {
  this.p$1 = p;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
var $d_sc_TraversableLike$WithFilter = new $TypeData().initClass({
  sc_TraversableLike$WithFilter: 0
}, false, "scala.collection.TraversableLike$WithFilter", {
  sc_TraversableLike$WithFilter: 1,
  O: 1,
  scg_FilterMonadic: 1
});
$c_sc_TraversableLike$WithFilter.prototype.$classData = $d_sc_TraversableLike$WithFilter;
/** @constructor */
function $c_scg_GenSetFactory() {
  $c_scg_GenericCompanion.call(this)
}
$c_scg_GenSetFactory.prototype = new $h_scg_GenericCompanion();
$c_scg_GenSetFactory.prototype.constructor = $c_scg_GenSetFactory;
/** @constructor */
function $h_scg_GenSetFactory() {
  /*<skip>*/
}
$h_scg_GenSetFactory.prototype = $c_scg_GenSetFactory.prototype;
/** @constructor */
function $c_scg_GenTraversableFactory() {
  $c_scg_GenericCompanion.call(this);
  this.ReusableCBFInstance$2 = null
}
$c_scg_GenTraversableFactory.prototype = new $h_scg_GenericCompanion();
$c_scg_GenTraversableFactory.prototype.constructor = $c_scg_GenTraversableFactory;
/** @constructor */
function $h_scg_GenTraversableFactory() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory.prototype = $c_scg_GenTraversableFactory.prototype;
$c_scg_GenTraversableFactory.prototype.init___ = (function() {
  this.ReusableCBFInstance$2 = new $c_scg_GenTraversableFactory$$anon$1().init___scg_GenTraversableFactory(this);
  return this
});
/** @constructor */
function $c_scg_GenTraversableFactory$GenericCanBuildFrom() {
  $c_O.call(this);
  this.$$outer$f = null
}
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype = new $h_O();
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.constructor = $c_scg_GenTraversableFactory$GenericCanBuildFrom;
/** @constructor */
function $h_scg_GenTraversableFactory$GenericCanBuildFrom() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory$GenericCanBuildFrom.prototype = $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype;
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.apply__scm_Builder = (function() {
  return this.$$outer$f.newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.apply__O__scm_Builder = (function(from) {
  var from$1 = $as_sc_GenTraversable(from);
  return from$1.companion__scg_GenericCompanion().newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
/** @constructor */
function $c_scg_MapFactory() {
  $c_scg_GenMapFactory.call(this)
}
$c_scg_MapFactory.prototype = new $h_scg_GenMapFactory();
$c_scg_MapFactory.prototype.constructor = $c_scg_MapFactory;
/** @constructor */
function $h_scg_MapFactory() {
  /*<skip>*/
}
$h_scg_MapFactory.prototype = $c_scg_MapFactory.prototype;
/** @constructor */
function $c_sci_List$$anon$1() {
  $c_O.call(this)
}
$c_sci_List$$anon$1.prototype = new $h_O();
$c_sci_List$$anon$1.prototype.constructor = $c_sci_List$$anon$1;
/** @constructor */
function $h_sci_List$$anon$1() {
  /*<skip>*/
}
$h_sci_List$$anon$1.prototype = $c_sci_List$$anon$1.prototype;
$c_sci_List$$anon$1.prototype.init___ = (function() {
  return this
});
$c_sci_List$$anon$1.prototype.apply__O__O = (function(x) {
  return this
});
$c_sci_List$$anon$1.prototype.toString__T = (function() {
  return "<function1>"
});
var $d_sci_List$$anon$1 = new $TypeData().initClass({
  sci_List$$anon$1: 0
}, false, "scala.collection.immutable.List$$anon$1", {
  sci_List$$anon$1: 1,
  O: 1,
  F1: 1
});
$c_sci_List$$anon$1.prototype.$classData = $d_sci_List$$anon$1;
function $is_scm_Builder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_Builder)))
}
function $as_scm_Builder(obj) {
  return (($is_scm_Builder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.Builder"))
}
function $isArrayOf_scm_Builder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_Builder)))
}
function $asArrayOf_scm_Builder(obj, depth) {
  return (($isArrayOf_scm_Builder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.Builder;", depth))
}
/** @constructor */
function $c_sr_AbstractFunction0() {
  $c_O.call(this)
}
$c_sr_AbstractFunction0.prototype = new $h_O();
$c_sr_AbstractFunction0.prototype.constructor = $c_sr_AbstractFunction0;
/** @constructor */
function $h_sr_AbstractFunction0() {
  /*<skip>*/
}
$h_sr_AbstractFunction0.prototype = $c_sr_AbstractFunction0.prototype;
$c_sr_AbstractFunction0.prototype.toString__T = (function() {
  return "<function0>"
});
/** @constructor */
function $c_sr_AbstractFunction1() {
  $c_O.call(this)
}
$c_sr_AbstractFunction1.prototype = new $h_O();
$c_sr_AbstractFunction1.prototype.constructor = $c_sr_AbstractFunction1;
/** @constructor */
function $h_sr_AbstractFunction1() {
  /*<skip>*/
}
$h_sr_AbstractFunction1.prototype = $c_sr_AbstractFunction1.prototype;
$c_sr_AbstractFunction1.prototype.toString__T = (function() {
  return "<function1>"
});
/** @constructor */
function $c_sr_BooleanRef() {
  $c_O.call(this);
  this.elem$1 = false
}
$c_sr_BooleanRef.prototype = new $h_O();
$c_sr_BooleanRef.prototype.constructor = $c_sr_BooleanRef;
/** @constructor */
function $h_sr_BooleanRef() {
  /*<skip>*/
}
$h_sr_BooleanRef.prototype = $c_sr_BooleanRef.prototype;
$c_sr_BooleanRef.prototype.toString__T = (function() {
  var value = this.elem$1;
  return ("" + value)
});
$c_sr_BooleanRef.prototype.init___Z = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_BooleanRef = new $TypeData().initClass({
  sr_BooleanRef: 0
}, false, "scala.runtime.BooleanRef", {
  sr_BooleanRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_BooleanRef.prototype.$classData = $d_sr_BooleanRef;
function $isArrayOf_sr_BoxedUnit(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sr_BoxedUnit)))
}
function $asArrayOf_sr_BoxedUnit(obj, depth) {
  return (($isArrayOf_sr_BoxedUnit(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.runtime.BoxedUnit;", depth))
}
var $d_sr_BoxedUnit = new $TypeData().initClass({
  sr_BoxedUnit: 0
}, false, "scala.runtime.BoxedUnit", {
  sr_BoxedUnit: 1,
  O: 1,
  Ljava_io_Serializable: 1
}, (void 0), (void 0), (function(x) {
  return (x === (void 0))
}));
/** @constructor */
function $c_sr_IntRef() {
  $c_O.call(this);
  this.elem$1 = 0
}
$c_sr_IntRef.prototype = new $h_O();
$c_sr_IntRef.prototype.constructor = $c_sr_IntRef;
/** @constructor */
function $h_sr_IntRef() {
  /*<skip>*/
}
$h_sr_IntRef.prototype = $c_sr_IntRef.prototype;
$c_sr_IntRef.prototype.toString__T = (function() {
  var value = this.elem$1;
  return ("" + value)
});
$c_sr_IntRef.prototype.init___I = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_IntRef = new $TypeData().initClass({
  sr_IntRef: 0
}, false, "scala.runtime.IntRef", {
  sr_IntRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_IntRef.prototype.$classData = $d_sr_IntRef;
/** @constructor */
function $c_sr_ObjectRef() {
  $c_O.call(this);
  this.elem$1 = null
}
$c_sr_ObjectRef.prototype = new $h_O();
$c_sr_ObjectRef.prototype.constructor = $c_sr_ObjectRef;
/** @constructor */
function $h_sr_ObjectRef() {
  /*<skip>*/
}
$h_sr_ObjectRef.prototype = $c_sr_ObjectRef.prototype;
$c_sr_ObjectRef.prototype.toString__T = (function() {
  return $m_sjsr_RuntimeString$().valueOf__O__T(this.elem$1)
});
$c_sr_ObjectRef.prototype.init___O = (function(elem) {
  this.elem$1 = elem;
  return this
});
var $d_sr_ObjectRef = new $TypeData().initClass({
  sr_ObjectRef: 0
}, false, "scala.runtime.ObjectRef", {
  sr_ObjectRef: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_sr_ObjectRef.prototype.$classData = $d_sr_ObjectRef;
/** @constructor */
function $c_Lcom_badlogic_gdx_scenes_scene2d_Stage() {
  $c_Lcom_badlogic_gdx_InputAdapter.call(this);
  this.height$2 = 0;
  this.width$2 = 0
}
$c_Lcom_badlogic_gdx_scenes_scene2d_Stage.prototype = new $h_Lcom_badlogic_gdx_InputAdapter();
$c_Lcom_badlogic_gdx_scenes_scene2d_Stage.prototype.constructor = $c_Lcom_badlogic_gdx_scenes_scene2d_Stage;
/** @constructor */
function $h_Lcom_badlogic_gdx_scenes_scene2d_Stage() {
  /*<skip>*/
}
$h_Lcom_badlogic_gdx_scenes_scene2d_Stage.prototype = $c_Lcom_badlogic_gdx_scenes_scene2d_Stage.prototype;
$c_Lcom_badlogic_gdx_scenes_scene2d_Stage.prototype.init___ = (function() {
  this.height$2 = $uI($g.gdx.Gdx.graphics.getHeight());
  this.width$2 = $uI($g.gdx.Gdx.graphics.getWidth());
  return this
});
$c_Lcom_badlogic_gdx_scenes_scene2d_Stage.prototype.getWidth__F = (function() {
  return $fround(this.height$2)
});
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_Demo() {
  $c_Lcom_badlogic_gdx_Game.call(this);
  this.menuScene$2 = null;
  this.gameScene$2 = null;
  this.optionScene$2 = null;
  this.scoreScene$2 = null
}
$c_Lcom_darkoverlordofdata_demo_Demo.prototype = new $h_Lcom_badlogic_gdx_Game();
$c_Lcom_darkoverlordofdata_demo_Demo.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_Demo;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_Demo() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_Demo.prototype = $c_Lcom_darkoverlordofdata_demo_Demo.prototype;
$c_Lcom_darkoverlordofdata_demo_Demo.prototype.init___ = (function() {
  $c_Lcom_badlogic_gdx_Game.prototype.init___.call(this);
  this.menuScene$2 = null;
  this.gameScene$2 = null;
  this.optionScene$2 = null;
  this.scoreScene$2 = null;
  return this
});
$c_Lcom_darkoverlordofdata_demo_Demo.prototype.playGame__V = (function() {
  var sceneLoader = new $g.uwsoft.editor.renderer.SceneLoader();
  new $c_Lcom_darkoverlordofdata_demo_MenuUI().init___Lcom_darkoverlordofdata_demo_Demo__Lcom_uwsoft_editor_renderer_SceneLoader(this, sceneLoader);
  this.optionScene$2 = null;
  this.scoreScene$2 = null;
  this.gameScene$2 = new $c_Lcom_darkoverlordofdata_demo_GameScene().init___();
  this.setScreen__Lcom_badlogic_gdx_Screen__V(this.gameScene$2)
});
var $d_Lcom_darkoverlordofdata_demo_Demo = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_Demo: 0
}, false, "com.darkoverlordofdata.demo.Demo", {
  Lcom_darkoverlordofdata_demo_Demo: 1,
  Lcom_badlogic_gdx_Game: 1,
  O: 1,
  Lcom_badlogic_gdx_ApplicationListener: 1
});
$c_Lcom_darkoverlordofdata_demo_Demo.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_Demo;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.bullets$1 = null;
  this.enemies$1 = null;
  this.players$1 = null;
  this.bitmap$0$1 = 0
}
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_CollisionSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("CollisionSystem\n");
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.bullets$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if (((1 & this.bitmap$0$1) === 0)) {
    this.bullets$1 = this.pool$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().Bullet$1);
    this.bitmap$0$1 = (1 | this.bitmap$0$1)
  };
  return this.bullets$1
});
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.players$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if (((4 & this.bitmap$0$1) === 0)) {
    this.players$1 = this.pool$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().Player$1);
    this.bitmap$0$1 = (4 | this.bitmap$0$1)
  };
  return this.players$1
});
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.players__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return (((4 & this.bitmap$0$1) === 0) ? this.players$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.players$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.collisionHandler__Lcom_darkoverlordofdata_entitas_Entity__Lcom_darkoverlordofdata_entitas_Entity__V = (function(weapon, ship) {
  var pos = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(weapon)).position__Lcom_darkoverlordofdata_demo_PositionComponent();
  var pool = this.pool$1;
  new $c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory().init___Lcom_darkoverlordofdata_entitas_Pool(pool).createSmallExplosion__F__F__Lcom_darkoverlordofdata_entitas_Entity(pos.x$1, pos.y$1);
  ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(weapon)).setDestroy__Z__Lcom_darkoverlordofdata_entitas_Entity(true);
  var health = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(ship)).health__Lcom_darkoverlordofdata_demo_HealthComponent();
  $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
  var jsx$1 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(ship);
  var currentHealth = $fround(((-1.0) + health.currentHealth$1));
  var maximumHealth = health.maximumHealth$1;
  jsx$1.updateHealth__Lcom_darkoverlordofdata_demo_HealthComponent__Lcom_darkoverlordofdata_entitas_Entity(new $c_Lcom_darkoverlordofdata_demo_HealthComponent().init___F__F(currentHealth, maximumHealth));
  if ((health.currentHealth$1 <= 0.0)) {
    var position = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(ship)).position__Lcom_darkoverlordofdata_demo_PositionComponent();
    var pool$1 = this.pool$1;
    new $c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory().init___Lcom_darkoverlordofdata_entitas_Pool(pool$1).createBigExplosion__F__F__Lcom_darkoverlordofdata_entitas_Entity(position.x$1, position.y$1);
    ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(ship)).setDestroy__Z__Lcom_darkoverlordofdata_entitas_Entity(true);
    var player = this.players__Lcom_darkoverlordofdata_entitas_Group().singleEntity__Lcom_darkoverlordofdata_entitas_Entity();
    if ((player !== null)) {
      var score = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(player)).score__Lcom_darkoverlordofdata_demo_ScoreComponent();
      $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
      var jsx$2 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(player);
      var value = ((score.value$1 + $doubleToInt(health.maximumHealth$1)) | 0);
      jsx$2.updateScore__Lcom_darkoverlordofdata_demo_ScoreComponent__Lcom_darkoverlordofdata_entitas_Entity(new $c_Lcom_darkoverlordofdata_demo_ScoreComponent().init___I(value))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.collidesWith__Lcom_darkoverlordofdata_entitas_Entity__Lcom_darkoverlordofdata_entitas_Entity__Z = (function(e1, e2) {
  var position1 = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(e1)).position__Lcom_darkoverlordofdata_demo_PositionComponent();
  var position2 = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(e2)).position__Lcom_darkoverlordofdata_demo_PositionComponent();
  var a = $fround((position1.x$1 - position2.x$1));
  var b = $fround((position1.y$1 - position2.y$1));
  var a$1 = ((a * a) + (b * b));
  return (($uD($g.Math.sqrt(a$1)) - ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(e1)).bounds__Lcom_darkoverlordofdata_demo_BoundsComponent().radius$1) < ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(e2)).bounds__Lcom_darkoverlordofdata_demo_BoundsComponent().radius$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.enemies__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return (((2 & this.bitmap$0$1) === 0) ? this.enemies$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.enemies$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.execute__V = (function() {
  var this$1 = this.bullets__Lcom_darkoverlordofdata_entitas_Group().entities__sci_List();
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    var v1 = these.head__O();
    var bullet = $as_Lcom_darkoverlordofdata_entitas_Entity(v1);
    var this$2 = this.enemies__Lcom_darkoverlordofdata_entitas_Group().entities__sci_List();
    var these$1 = this$2;
    while ((!these$1.isEmpty__Z())) {
      var arg1 = these$1.head__O();
      var enemy = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1);
      if (this.collidesWith__Lcom_darkoverlordofdata_entitas_Entity__Lcom_darkoverlordofdata_entitas_Entity__Z(bullet, enemy)) {
        this.collisionHandler__Lcom_darkoverlordofdata_entitas_Entity__Lcom_darkoverlordofdata_entitas_Entity__V(bullet, enemy)
      };
      these$1 = $as_sci_List(these$1.tail__O())
    };
    these = $as_sci_List(these.tail__O())
  }
});
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.enemies$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if (((2 & this.bitmap$0$1) === 0)) {
    this.enemies$1 = this.pool$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().Enemy$1);
    this.bitmap$0$1 = (2 | this.bitmap$0$1)
  };
  return this.enemies$1
});
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.bullets__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return (((1 & this.bitmap$0$1) === 0) ? this.bullets$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.bullets$1)
});
var $d_Lcom_darkoverlordofdata_demo_systems_CollisionSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_CollisionSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.CollisionSystem", {
  Lcom_darkoverlordofdata_demo_systems_CollisionSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_CollisionSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_CollisionSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_DestroySystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.group$1 = null;
  this.bitmap$0$1 = false
}
$c_Lcom_darkoverlordofdata_demo_systems_DestroySystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_DestroySystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_DestroySystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_DestroySystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_DestroySystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_DestroySystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_DestroySystem.prototype.group__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return ((!this.bitmap$0$1) ? this.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.group$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_DestroySystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("DestroySystem\n");
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_DestroySystem.prototype.execute__V = (function() {
  var this$2 = this.group__Lcom_darkoverlordofdata_entitas_Group().entities__sci_List();
  var f = (function(arg$outer) {
    return (function(entity$2) {
      var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(entity$2);
      return arg$outer.pool$1.destroyEntity__Lcom_darkoverlordofdata_entitas_Entity__O(entity)
    })
  })(this);
  var this$1 = $m_sci_List$();
  var bf = this$1.ReusableCBFInstance$2;
  if ((bf === $m_sci_List$().ReusableCBFInstance$2)) {
    if ((this$2 !== $m_sci_Nil$())) {
      var arg1 = this$2.head__O();
      var h = new $c_sci_$colon$colon().init___O__sci_List(f(arg1), $m_sci_Nil$());
      var t = h;
      var rest = $as_sci_List(this$2.tail__O());
      while ((rest !== $m_sci_Nil$())) {
        var arg1$1 = rest.head__O();
        var nx = new $c_sci_$colon$colon().init___O__sci_List(f(arg1$1), $m_sci_Nil$());
        t.tl$5 = nx;
        t = nx;
        rest = $as_sci_List(rest.tail__O())
      }
    }
  } else {
    var b = $s_sc_TraversableLike$class__builder$1__p0__sc_TraversableLike__scg_CanBuildFrom__scm_Builder(this$2, bf);
    var these = this$2;
    while ((!these.isEmpty__Z())) {
      var arg1$2 = these.head__O();
      b.$$plus$eq__O__scm_Builder(f(arg1$2));
      these = $as_sci_List(these.tail__O())
    };
    b.result__O()
  }
});
$c_Lcom_darkoverlordofdata_demo_systems_DestroySystem.prototype.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if ((!this.bitmap$0$1)) {
    this.group$1 = this.pool$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().Destroy$1);
    this.bitmap$0$1 = true
  };
  return this.group$1
});
var $d_Lcom_darkoverlordofdata_demo_systems_DestroySystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_DestroySystem: 0
}, false, "com.darkoverlordofdata.demo.systems.DestroySystem", {
  Lcom_darkoverlordofdata_demo_systems_DestroySystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_DestroySystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_DestroySystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.Timer1$1 = 0.0;
  this.Timer2$1 = 0.0;
  this.Timer3$1 = 0.0;
  this.t1$1 = 0.0;
  this.t2$1 = 0.0;
  this.t3$1 = 0.0;
  this.Enemies$module$1 = null
}
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype.spawnEnemy__F__F__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$EnumVal__F = (function(delta, t, enemy) {
  var remaining = $fround((t - $uF($g.gdx.Gdx.graphics.getDeltaTime())));
  if ((remaining < 0.0)) {
    var x = this.Enemies__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$().Enemy1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$();
    if ((x === enemy)) {
      var pool = this.pool$1;
      new $c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory().init___Lcom_darkoverlordofdata_entitas_Pool(pool).createEnemy1__F__F__Lcom_darkoverlordofdata_entitas_Entity(this.width__F(), this.height__F());
      return this.Timer1$1
    } else {
      var x$3 = this.Enemies__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$().Enemy2__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$();
      if ((x$3 === enemy)) {
        var pool$1 = this.pool$1;
        new $c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory().init___Lcom_darkoverlordofdata_entitas_Pool(pool$1).createEnemy2__F__F__Lcom_darkoverlordofdata_entitas_Entity(this.width__F(), this.height__F());
        return this.Timer2$1
      } else {
        var x$5 = this.Enemies__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$().Enemy3__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$();
        if ((x$5 === enemy)) {
          var pool$2 = this.pool$1;
          new $c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory().init___Lcom_darkoverlordofdata_entitas_Pool(pool$2).createEnemy3__F__F__Lcom_darkoverlordofdata_entitas_Entity(this.width__F(), this.height__F());
          return this.Timer3$1
        } else {
          throw new $c_s_MatchError().init___O(enemy)
        }
      }
    }
  } else {
    return remaining
  }
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("EntitySpawningTimerSystem\n");
  this.Timer1$1 = 2.0;
  this.Timer2$1 = 6.0;
  this.Timer3$1 = 12.0;
  this.t1$1 = this.Timer1$1;
  this.t2$1 = this.Timer2$1;
  this.t3$1 = this.Timer3$1;
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype.width__F = (function() {
  return $fround(($fround(this.game$1.width__I()) * this.toWorldX__F()))
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype.Enemies__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$ = (function() {
  return ((this.Enemies$module$1 === null) ? this.Enemies$lzycompute__p1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$() : this.Enemies$module$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype.toWorldX__F = (function() {
  return $fround((320.0 / $fround(this.game$1.width__I())))
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype.height__F = (function() {
  return $fround(($fround(this.game$1.height__I()) * this.toWorldY__F()))
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype.Enemies$lzycompute__p1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$ = (function() {
  if ((this.Enemies$module$1 === null)) {
    this.Enemies$module$1 = new $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$().init___Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem(this)
  };
  return this.Enemies$module$1
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype.toWorldY__F = (function() {
  return $fround((480.0 / $fround(this.game$1.height__I())))
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype.execute__V = (function() {
  var delta = $uF($g.gdx.Gdx.graphics.getDeltaTime());
  this.t1$1 = this.spawnEnemy__F__F__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$EnumVal__F(delta, this.t1$1, this.Enemies__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$().Enemy1__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$());
  this.t2$1 = this.spawnEnemy__F__F__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$EnumVal__F(delta, this.t2$1, this.Enemies__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$().Enemy2__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$());
  this.t3$1 = this.spawnEnemy__F__F__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$EnumVal__F(delta, this.t3$1, this.Enemies__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$().Enemy3__Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$())
});
var $d_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.EntitySpawningTimerSystem", {
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.group$1 = null;
  this.bitmap$0$1 = false
}
$c_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem.prototype.group__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return ((!this.bitmap$0$1) ? this.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.group$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("ExpiringSystem\n");
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem.prototype.execute__V = (function() {
  var delta = $uF($g.gdx.Gdx.graphics.getDeltaTime());
  var this$1 = this.group__Lcom_darkoverlordofdata_entitas_Group().entities__sci_List();
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1);
    var expires = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).expires__Lcom_darkoverlordofdata_demo_ExpiresComponent();
    $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
    var jsx$1 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity);
    var delay = $fround((expires.delay$1 - delta));
    jsx$1.updateExpires__Lcom_darkoverlordofdata_demo_ExpiresComponent__Lcom_darkoverlordofdata_entitas_Entity(new $c_Lcom_darkoverlordofdata_demo_ExpiresComponent().init___F(delay));
    if ((($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).expires__Lcom_darkoverlordofdata_demo_ExpiresComponent().delay$1 < 0.0)) {
      this.pool$1.destroyEntity__Lcom_darkoverlordofdata_entitas_Entity__O(entity)
    };
    these = $as_sci_List(these.tail__O())
  }
});
$c_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem.prototype.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if ((!this.bitmap$0$1)) {
    this.group$1 = this.pool$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().Expires$1);
    this.bitmap$0$1 = true
  };
  return this.group$1
});
var $d_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_ExpiringSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.ExpiringSystem", {
  Lcom_darkoverlordofdata_demo_systems_ExpiringSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_ExpiringSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.group$1 = null;
  this.camera$1 = null;
  this.batch$1 = null;
  this.font$1 = null;
  this.bitmap$0$1 = 0
}
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.group__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return (((1 & this.bitmap$0$1) === 0) ? this.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.group$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("HealthRenderSystem\n");
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.CreateFont__T__Lcom_badlogic_gdx_graphics_g2d_BitmapFont = (function(file) {
  var fontTexture = new $g.gdx.graphics.Texture($g.gdx.Gdx.files.internal(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", "_0.png"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([file]))));
  fontTexture.setFilter($uI($g.gdx.graphics.Texture.TextureFilter.Linear), $uI($g.gdx.graphics.Texture.TextureFilter.MipMapLinearLinear));
  var fontRegion = new $g.gdx.graphics.g2d.TextureRegion(fontTexture);
  var font = new $g.gdx.graphics.g2d.BitmapFont($g.gdx.Gdx.files.internal(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", ".fnt"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([file]))), fontRegion, false);
  font.setUseIntegerPositions(false);
  return font
});
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.font__Lcom_badlogic_gdx_graphics_g2d_BitmapFont = (function() {
  return (((8 & this.bitmap$0$1) === 0) ? this.font$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_BitmapFont() : this.font$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch = (function() {
  return (((4 & this.bitmap$0$1) === 0) ? this.batch$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch() : this.batch$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.camera__Lcom_badlogic_gdx_graphics_OrthographicCamera = (function() {
  return (((2 & this.bitmap$0$1) === 0) ? this.camera$lzycompute__p1__Lcom_badlogic_gdx_graphics_OrthographicCamera() : this.camera$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.font$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_BitmapFont = (function() {
  if (((8 & this.bitmap$0$1) === 0)) {
    this.font$1 = this.CreateFont__T__Lcom_badlogic_gdx_graphics_g2d_BitmapFont("fonts/normal");
    this.bitmap$0$1 = (8 | this.bitmap$0$1)
  };
  return this.font$1
});
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.execute__V = (function() {
  this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch().setProjectionMatrix(this.camera__Lcom_badlogic_gdx_graphics_OrthographicCamera().combined);
  this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch().begin();
  var this$1 = this.group__Lcom_darkoverlordofdata_entitas_Group().entities__sci_List();
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1);
    var health = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).health__Lcom_darkoverlordofdata_demo_HealthComponent();
    var position = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).position__Lcom_darkoverlordofdata_demo_PositionComponent();
    var percentage = $doubleToInt($uF($g.gdx.math.MathUtils.round($fround((100.0 * $fround((health.currentHealth$1 / health.maximumHealth$1)))))));
    this.font__Lcom_badlogic_gdx_graphics_g2d_BitmapFont().draw(this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch(), new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", "%"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([percentage])), position.x$1, position.y$1);
    these = $as_sci_List(these.tail__O())
  };
  this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch().end()
});
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.camera$lzycompute__p1__Lcom_badlogic_gdx_graphics_OrthographicCamera = (function() {
  if (((2 & this.bitmap$0$1) === 0)) {
    this.camera$1 = this.game$1.camera__Lcom_badlogic_gdx_graphics_OrthographicCamera();
    this.bitmap$0$1 = (2 | this.bitmap$0$1)
  };
  return this.camera$1
});
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if (((1 & this.bitmap$0$1) === 0)) {
    var jsx$1 = this.pool$1;
    var this$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$();
    var array = [$m_Lcom_darkoverlordofdata_demo_Match$().Position$1, $m_Lcom_darkoverlordofdata_demo_Match$().Health$1];
    var result = new $c_scm_ListBuffer().init___();
    var i = 0;
    var len = $uI(array.length);
    while ((i < len)) {
      var index = i;
      var arg1 = array[index];
      var arg = $as_Lcom_darkoverlordofdata_entitas_IMatcher(arg1);
      result.$$plus$eq__O__scm_ListBuffer(arg);
      i = ((1 + i) | 0)
    };
    var this$3 = result.scala$collection$mutable$ListBuffer$$start$6;
    var len$1 = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this$3);
    var result$1 = $newArrayObject($d_Lcom_darkoverlordofdata_entitas_IMatcher.getArrayOf(), [len$1]);
    $s_sc_TraversableOnce$class__copyToArray__sc_TraversableOnce__O__I__V(this$3, result$1, 0);
    this.group$1 = jsx$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group(this$1.allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher(this$1.mergeIndices__ALcom_darkoverlordofdata_entitas_IMatcher__AI(result$1)));
    this.bitmap$0$1 = (1 | this.bitmap$0$1)
  };
  return this.group$1
});
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.batch$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch = (function() {
  if (((4 & this.bitmap$0$1) === 0)) {
    this.batch$1 = new $g.gdx.graphics.g2d.SpriteBatch();
    this.bitmap$0$1 = (4 | this.bitmap$0$1)
  };
  return this.batch$1
});
var $d_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.HealthRenderSystem", {
  Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_HealthRenderSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.group$1 = null;
  this.bitmap$0$1 = false
}
$c_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem.prototype.group__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return ((!this.bitmap$0$1) ? this.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.group$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("PhysicsSystem\n");
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem.prototype.execute__V = (function() {
  var this$1 = this.group__Lcom_darkoverlordofdata_entitas_Group().entities__sci_List();
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1);
    var position = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).position__Lcom_darkoverlordofdata_demo_PositionComponent();
    $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
    var jsx$1 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity);
    var x = $fround((position.x$1 + $fround((($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).velocity__Lcom_darkoverlordofdata_demo_VelocityComponent().x$1 * $uF($g.gdx.Gdx.graphics.getDeltaTime())))));
    var y = $fround((position.y$1 - $fround((($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).velocity__Lcom_darkoverlordofdata_demo_VelocityComponent().y$1 * $uF($g.gdx.Gdx.graphics.getDeltaTime())))));
    jsx$1.updatePosition__Lcom_darkoverlordofdata_demo_PositionComponent__Lcom_darkoverlordofdata_entitas_Entity(new $c_Lcom_darkoverlordofdata_demo_PositionComponent().init___F__F(x, y));
    these = $as_sci_List(these.tail__O())
  }
});
$c_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem.prototype.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if ((!this.bitmap$0$1)) {
    var jsx$1 = this.pool$1;
    var this$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$();
    var array = [$m_Lcom_darkoverlordofdata_demo_Match$().Position$1, $m_Lcom_darkoverlordofdata_demo_Match$().Velocity$1];
    var result = new $c_scm_ListBuffer().init___();
    var i = 0;
    var len = $uI(array.length);
    while ((i < len)) {
      var index = i;
      var arg1 = array[index];
      var arg = $as_Lcom_darkoverlordofdata_entitas_IMatcher(arg1);
      result.$$plus$eq__O__scm_ListBuffer(arg);
      i = ((1 + i) | 0)
    };
    var this$3 = result.scala$collection$mutable$ListBuffer$$start$6;
    var len$1 = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this$3);
    var result$1 = $newArrayObject($d_Lcom_darkoverlordofdata_entitas_IMatcher.getArrayOf(), [len$1]);
    $s_sc_TraversableOnce$class__copyToArray__sc_TraversableOnce__O__I__V(this$3, result$1, 0);
    this.group$1 = jsx$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group(this$1.allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher(this$1.mergeIndices__ALcom_darkoverlordofdata_entitas_IMatcher__AI(result$1)));
    this.bitmap$0$1 = true
  };
  return this.group$1
});
var $d_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_PhysicsSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.PhysicsSystem", {
  Lcom_darkoverlordofdata_demo_systems_PhysicsSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_PhysicsSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.group$1 = null;
  this.bitmap$0$1 = false
}
$c_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem.prototype.group__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return ((!this.bitmap$0$1) ? this.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.group$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("RemoveOffscreenShipsSystem\n");
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem.prototype.execute__V = (function() {
  var this$1 = this.group__Lcom_darkoverlordofdata_entitas_Group().entities__sci_List();
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1);
    if (($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).isEnemy__Z()) {
      if ((($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).position__Lcom_darkoverlordofdata_demo_PositionComponent().y$1 < 0.0)) {
        this.pool$1.destroyEntity__Lcom_darkoverlordofdata_entitas_Entity__O(entity)
      }
    };
    these = $as_sci_List(these.tail__O())
  }
});
$c_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem.prototype.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if ((!this.bitmap$0$1)) {
    this.group$1 = this.pool$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().Position$1);
    this.bitmap$0$1 = true
  };
  return this.group$1
});
var $d_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.RemoveOffscreenShipsSystem", {
  Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_RemoveOffscreenShipsSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.group$1 = null;
  this.bitmap$0$1 = false
}
$c_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem.prototype.group__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return ((!this.bitmap$0$1) ? this.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.group$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("ScaleTweenSystem\n");
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem.prototype.execute__V = (function() {
  var delta = $uF($g.gdx.Gdx.graphics.getDeltaTime());
  var this$1 = this.group__Lcom_darkoverlordofdata_entitas_Group().entities__sci_List();
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1);
    var tween = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).tween__Lcom_darkoverlordofdata_demo_TweenComponent();
    var scale = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).scale__Lcom_darkoverlordofdata_demo_ScaleComponent();
    var x = scale.x$1;
    var y = scale.y$1;
    var active = tween.active$1;
    x = $fround((x + $fround((tween.speed$1 * delta))));
    y = $fround((y + $fround((tween.speed$1 * delta))));
    if ((x > tween.max$1)) {
      x = tween.max$1;
      y = tween.max$1;
      active = false
    } else if ((x < tween.min$1)) {
      x = tween.min$1;
      y = tween.min$1;
      active = false
    };
    $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
    var jsx$1 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity);
    var x$1 = x;
    var y$1 = y;
    jsx$1.updateScale__Lcom_darkoverlordofdata_demo_ScaleComponent__Lcom_darkoverlordofdata_entitas_Entity(new $c_Lcom_darkoverlordofdata_demo_ScaleComponent().init___F__F(x$1, y$1));
    $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
    var jsx$2 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity);
    var x$1$1 = active;
    var x$2 = tween.min$1;
    var x$3 = tween.max$1;
    var x$4 = tween.speed$1;
    var x$5 = tween.repeat$1;
    jsx$2.updateTween__Lcom_darkoverlordofdata_demo_TweenComponent__Lcom_darkoverlordofdata_entitas_Entity(new $c_Lcom_darkoverlordofdata_demo_TweenComponent().init___F__F__F__Z__Z(x$2, x$3, x$4, x$5, x$1$1));
    these = $as_sci_List(these.tail__O())
  }
});
$c_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem.prototype.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if ((!this.bitmap$0$1)) {
    var jsx$1 = this.pool$1;
    var this$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$();
    var array = [$m_Lcom_darkoverlordofdata_demo_Match$().Scale$1, $m_Lcom_darkoverlordofdata_demo_Match$().Tween$1];
    var result = new $c_scm_ListBuffer().init___();
    var i = 0;
    var len = $uI(array.length);
    while ((i < len)) {
      var index = i;
      var arg1 = array[index];
      var arg = $as_Lcom_darkoverlordofdata_entitas_IMatcher(arg1);
      result.$$plus$eq__O__scm_ListBuffer(arg);
      i = ((1 + i) | 0)
    };
    var this$3 = result.scala$collection$mutable$ListBuffer$$start$6;
    var len$1 = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this$3);
    var result$1 = $newArrayObject($d_Lcom_darkoverlordofdata_entitas_IMatcher.getArrayOf(), [len$1]);
    $s_sc_TraversableOnce$class__copyToArray__sc_TraversableOnce__O__I__V(this$3, result$1, 0);
    this.group$1 = jsx$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group(this$1.allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher(this$1.mergeIndices__ALcom_darkoverlordofdata_entitas_IMatcher__AI(result$1)));
    this.bitmap$0$1 = true
  };
  return this.group$1
});
var $d_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.ScaleTweenSystem", {
  Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_ScaleTweenSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.group$1 = null;
  this.width$1 = 0;
  this.height$1 = 0;
  this.pixelFactor$1 = 0;
  this.camera$1 = null;
  this.batch$1 = null;
  this.font$1 = null;
  this.bitmap$0$1 = 0
}
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype.group__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return (((1 & this.bitmap$0$1) === 0) ? this.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.group$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("ScoreRenderSystem\n");
  this.width$1 = game.width__I();
  this.height$1 = game.height__I();
  this.pixelFactor$1 = game.pixelFactor__I();
  this.camera$1 = game.camera__Lcom_badlogic_gdx_graphics_OrthographicCamera();
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype.CreateFont__T__Lcom_badlogic_gdx_graphics_g2d_BitmapFont = (function(file) {
  var fontTexture = new $g.gdx.graphics.Texture($g.gdx.Gdx.files.internal(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", "_0.png"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([file]))));
  fontTexture.setFilter($uI($g.gdx.graphics.Texture.TextureFilter.Linear), $uI($g.gdx.graphics.Texture.TextureFilter.MipMapLinearLinear));
  var fontRegion = new $g.gdx.graphics.g2d.TextureRegion(fontTexture);
  var font = new $g.gdx.graphics.g2d.BitmapFont($g.gdx.Gdx.files.internal(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", ".fnt"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([file]))), fontRegion, false);
  font.setUseIntegerPositions(false);
  return font
});
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype.font__Lcom_badlogic_gdx_graphics_g2d_BitmapFont = (function() {
  return (((4 & this.bitmap$0$1) === 0) ? this.font$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_BitmapFont() : this.font$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch = (function() {
  return (((2 & this.bitmap$0$1) === 0) ? this.batch$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch() : this.batch$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype.font$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_BitmapFont = (function() {
  if (((4 & this.bitmap$0$1) === 0)) {
    this.font$1 = this.CreateFont__T__Lcom_badlogic_gdx_graphics_g2d_BitmapFont("fonts/hud");
    this.bitmap$0$1 = (4 | this.bitmap$0$1)
  };
  return this.font$1
});
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype.execute__V = (function() {
  this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch().setProjectionMatrix(this.camera$1.combined);
  this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch().begin();
  var player = this.group__Lcom_darkoverlordofdata_entitas_Group().singleEntity__Lcom_darkoverlordofdata_entitas_Entity();
  if ((player !== null)) {
    this.font__Lcom_badlogic_gdx_graphics_g2d_BitmapFont().draw(this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch(), new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(player)).score__Lcom_darkoverlordofdata_demo_ScoreComponent().value$1])), $fround(($fround(this.width$1) / 2.0)), $fround(((-10.0) + $fround(this.height$1))))
  };
  this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch().end()
});
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if (((1 & this.bitmap$0$1) === 0)) {
    var jsx$1 = this.pool$1;
    var this$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$();
    var array = [$m_Lcom_darkoverlordofdata_demo_Match$().Player$1, $m_Lcom_darkoverlordofdata_demo_Match$().Score$1];
    var result = new $c_scm_ListBuffer().init___();
    var i = 0;
    var len = $uI(array.length);
    while ((i < len)) {
      var index = i;
      var arg1 = array[index];
      var arg = $as_Lcom_darkoverlordofdata_entitas_IMatcher(arg1);
      result.$$plus$eq__O__scm_ListBuffer(arg);
      i = ((1 + i) | 0)
    };
    var this$3 = result.scala$collection$mutable$ListBuffer$$start$6;
    var len$1 = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this$3);
    var result$1 = $newArrayObject($d_Lcom_darkoverlordofdata_entitas_IMatcher.getArrayOf(), [len$1]);
    $s_sc_TraversableOnce$class__copyToArray__sc_TraversableOnce__O__I__V(this$3, result$1, 0);
    this.group$1 = jsx$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group(this$1.allOf__AI__Lcom_darkoverlordofdata_entitas_IAllOfMatcher(this$1.mergeIndices__ALcom_darkoverlordofdata_entitas_IMatcher__AI(result$1)));
    this.bitmap$0$1 = (1 | this.bitmap$0$1)
  };
  return this.group$1
});
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype.batch$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch = (function() {
  if (((2 & this.bitmap$0$1) === 0)) {
    this.batch$1 = new $g.gdx.graphics.g2d.SpriteBatch();
    this.bitmap$0$1 = (2 | this.bitmap$0$1)
  };
  return this.batch$1
});
var $d_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.ScoreRenderSystem", {
  Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_ScoreRenderSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.group$1 = null;
  this.sound$1 = null;
  this.bitmap$0$1 = false
}
$c_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("SoundEffectSystem\n");
  this.group$1 = pool.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().SoundEffect$1);
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem.prototype.execute__V = (function() {
  var this$1 = this.group$1.entities__sci_List();
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1);
    var jsx$1 = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).soundEffect__Lcom_darkoverlordofdata_demo_SoundEffectComponent().effect$1;
    var this$3 = this.sound__sci_List();
    if ((jsx$1 <= $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this$3))) {
      var this$5 = this.sound__sci_List();
      var n = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).soundEffect__Lcom_darkoverlordofdata_demo_SoundEffectComponent().effect$1;
      $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this$5, n).play()
    };
    ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).removeSoundEffect__Lcom_darkoverlordofdata_entitas_Entity();
    these = $as_sci_List(these.tail__O())
  }
});
$c_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem.prototype.sound__sci_List = (function() {
  return ((!this.bitmap$0$1) ? this.sound$lzycompute__p1__sci_List() : this.sound$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem.prototype.sound$lzycompute__p1__sci_List = (function() {
  if ((!this.bitmap$0$1)) {
    $m_sci_List$();
    var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array([$g.gdx.Gdx.audio.newSound($g.gdx.Gdx.files.internal("sfx/pew.ogg")), $g.gdx.Gdx.audio.newSound($g.gdx.Gdx.files.internal("sfx/asplode.ogg")), $g.gdx.Gdx.audio.newSound($g.gdx.Gdx.files.internal("sfx/smallasplode.ogg"))]);
    var this$2 = $m_sci_List$();
    var cbf = this$2.ReusableCBFInstance$2;
    this.sound$1 = $as_sci_List($s_sc_TraversableLike$class__to__sc_TraversableLike__scg_CanBuildFrom__O(xs, cbf));
    this.bitmap$0$1 = true
  };
  return this.sound$1
});
var $d_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.SoundEffectSystem", {
  Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_SoundEffectSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.group$1 = null;
  this.scale$1 = 0.0;
  this.width$1 = 0.0;
  this.height$1 = 0.0;
  this.pixelFactor$1 = 0;
  this.batch$1 = null;
  this.camera$1 = null;
  this.viewport$1 = null;
  this.background$1 = null;
  this.sprites$1 = null;
  this.bitmap$0$1 = 0
}
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.group__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return (((1 & this.bitmap$0$1) === 0) ? this.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.group$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("SpriteRenderSystem\n");
  this.scale$1 = 0.800000011920929;
  this.width$1 = $fround(game.width__I());
  this.height$1 = $fround(game.height__I());
  this.pixelFactor$1 = game.pixelFactor__I();
  this.camera$1 = game.camera__Lcom_badlogic_gdx_graphics_OrthographicCamera();
  this.sprites$1 = new $c_scm_ListBuffer().init___();
  this.viewport__Lcom_badlogic_gdx_utils_viewport_FillViewport().applyCamera();
  this.camera$1.position.set($fround((this.width$1 / $fround((2.0 * $fround(this.pixelFactor$1))))), $fround((this.height$1 / $fround((2.0 * $fround(this.pixelFactor$1))))), 0.0);
  this.camera$1.update();
  var this$4 = this.group__Lcom_darkoverlordofdata_entitas_Group().onEntityAdded$1;
  var invoker = new $c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1().init___Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem(this);
  this$4.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker);
  var this$5 = this.group__Lcom_darkoverlordofdata_entitas_Group().onEntityRemoved$1;
  var invoker$1 = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(arg$outer) {
    return (function(e$2) {
      var e = $as_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(e$2);
      arg$outer.sprites$1.$$minus$eq__O__scm_ListBuffer(e.entity$1)
    })
  })(this));
  this$5.invokers$1.$$plus$eq__O__scm_ListBuffer(invoker$1);
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.resize__I__I__V = (function(width, height) {
  this.viewport__Lcom_badlogic_gdx_utils_viewport_FillViewport().update($fround(width), $fround(height));
  this.camera$1.position.set($fround(($uF(this.camera$1.viewportWidth) / 2.0)), $fround(($uF(this.camera$1.viewportHeight) / 2.0)), 0.0)
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.drawEntity__Lcom_darkoverlordofdata_entitas_Entity__V = (function(entity) {
  var sprite = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).view__Lcom_darkoverlordofdata_demo_ViewComponent().sprite$1;
  var scaleX = 1.0;
  var scaleY = 1.0;
  if ((sprite !== null)) {
    if (($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).hasScale__Z()) {
      scaleX = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).scale__Lcom_darkoverlordofdata_demo_ScaleComponent().x$1;
      scaleY = ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).scale__Lcom_darkoverlordofdata_demo_ScaleComponent().y$1;
      sprite.setScale($fround((scaleX * this.scale$1)), $fround((scaleY * this.scale$1)))
    } else {
      sprite.setScale(this.scale$1)
    };
    var x = $fround(($fround(($fround(($fround($uI(sprite.getWidth())) / 2.0)) * this.scale$1)) * scaleX));
    var y = $fround(($fround(($fround(($fround($uI(sprite.getHeight())) / 2.0)) * this.scale$1)) * scaleY));
    sprite.setPosition($fround((($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).position__Lcom_darkoverlordofdata_demo_PositionComponent().x$1 - x)), $fround((($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(entity)).position__Lcom_darkoverlordofdata_demo_PositionComponent().y$1 - y)));
    sprite.draw(this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch())
  }
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.viewport$lzycompute__p1__Lcom_badlogic_gdx_utils_viewport_FillViewport = (function() {
  if (((4 & this.bitmap$0$1) === 0)) {
    this.viewport$1 = new $g.gdx.utils.viewport.FillViewport($fround((this.width$1 / $fround(this.pixelFactor$1))), $fround((this.height$1 / $fround(this.pixelFactor$1))), this.camera$1);
    this.bitmap$0$1 = (4 | this.bitmap$0$1)
  };
  return this.viewport$1
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.background__Lcom_badlogic_gdx_graphics_g2d_Sprite = (function() {
  return (((8 & this.bitmap$0$1) === 0) ? this.background$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_Sprite() : this.background$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch = (function() {
  return (((2 & this.bitmap$0$1) === 0) ? this.batch$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch() : this.batch$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.viewport__Lcom_badlogic_gdx_utils_viewport_FillViewport = (function() {
  return (((4 & this.bitmap$0$1) === 0) ? this.viewport$lzycompute__p1__Lcom_badlogic_gdx_utils_viewport_FillViewport() : this.viewport$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.background$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_Sprite = (function() {
  if (((8 & this.bitmap$0$1) === 0)) {
    this.background$1 = $m_Lcom_darkoverlordofdata_demo_O2dLibrary$().getSprite__T__Lcom_badlogic_gdx_graphics_g2d_Sprite("background");
    this.bitmap$0$1 = (8 | this.bitmap$0$1)
  };
  return this.background$1
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.execute__V = (function() {
  $g.gdx.Gdx.gl.glClearColor(0.0, 0.0, 0.0, 1.0);
  $g.gdx.Gdx.gl.glClear($uD($g.gdx.graphics.GL20.GL_COLOR_BUFFER_BIT));
  this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch().setProjectionMatrix(this.camera$1.combined);
  this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch().begin();
  this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch().draw(this.background__Lcom_badlogic_gdx_graphics_g2d_Sprite(), 0.0, 0.0, this.width$1, this.height$1);
  var this$1 = this.sprites$1;
  var this$2 = this$1.scala$collection$mutable$ListBuffer$$start$6;
  var these = this$2;
  while ((!these.isEmpty__Z())) {
    var arg1 = these.head__O();
    var entity = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1);
    this.drawEntity__Lcom_darkoverlordofdata_entitas_Entity__V(entity);
    these = $as_sci_List(these.tail__O())
  };
  this.batch__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch().end()
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if (((1 & this.bitmap$0$1) === 0)) {
    this.group$1 = this.pool$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().View$1);
    this.bitmap$0$1 = (1 | this.bitmap$0$1)
  };
  return this.group$1
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.batch$lzycompute__p1__Lcom_badlogic_gdx_graphics_g2d_SpriteBatch = (function() {
  if (((2 & this.bitmap$0$1) === 0)) {
    this.batch$1 = new $g.gdx.graphics.g2d.SpriteBatch();
    this.bitmap$0$1 = (2 | this.bitmap$0$1)
  };
  return this.batch$1
});
var $d_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.SpriteRenderSystem", {
  Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_ReactiveSystem() {
  $c_O.call(this);
  this.pool$1 = null;
  this.subsystem$1 = null;
  this.$$undclearAfterExecute$1 = false;
  this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undbuffer$1 = null;
  this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undensureComponents$1 = null;
  this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undexcludeComponents$1 = null;
  this.$$undobserver$1 = null;
  this.triggers$1 = null;
  this.com$darkoverlordofdata$entitas$ReactiveSystem$$groups$1 = null;
  this.com$darkoverlordofdata$entitas$ReactiveSystem$$eventTypes$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_ReactiveSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_ReactiveSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_ReactiveSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_ReactiveSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_ReactiveSystem.prototype = $c_Lcom_darkoverlordofdata_entitas_ReactiveSystem.prototype;
$c_Lcom_darkoverlordofdata_entitas_ReactiveSystem.prototype.init___Lcom_darkoverlordofdata_entitas_Pool__Lcom_darkoverlordofdata_entitas_IReactiveExecuteSystem = (function(pool, subsystem) {
  this.pool$1 = pool;
  this.subsystem$1 = subsystem;
  this.$$undclearAfterExecute$1 = false;
  this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undbuffer$1 = new $c_scm_ArrayBuffer().init___();
  this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undensureComponents$1 = null;
  this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undexcludeComponents$1 = null;
  this.$$undobserver$1 = null;
  if ($is_Lcom_darkoverlordofdata_entitas_IReactiveSystem(subsystem)) {
    var x2 = $as_Lcom_darkoverlordofdata_entitas_IReactiveSystem(subsystem);
    var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array([x2.trigger__Lcom_darkoverlordofdata_entitas_TriggerOnEvent()]);
    var len = $uI(xs.array$6.length);
    var array = $newArrayObject($d_Lcom_darkoverlordofdata_entitas_TriggerOnEvent.getArrayOf(), [len]);
    var elem$1 = 0;
    elem$1 = 0;
    var this$4 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(xs, 0, $uI(xs.array$6.length));
    while (this$4.hasNext__Z()) {
      var arg1 = this$4.next__O();
      array.u[elem$1] = arg1;
      elem$1 = ((1 + elem$1) | 0)
    };
    var jsx$1 = array
  } else if ($is_Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem(subsystem)) {
    var x3 = $as_Lcom_darkoverlordofdata_entitas_IMultiReactiveSystem(subsystem);
    var jsx$1 = x3.triggers__ALcom_darkoverlordofdata_entitas_TriggerOnEvent()
  } else {
    var xs$1 = $m_sci_Nil$();
    $m_s_reflect_ManifestFactory$NothingManifest$();
    var len$1 = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(xs$1);
    var array$1 = $newArrayObject($d_O.getArrayOf(), [len$1]);
    var elem$1$1 = 0;
    elem$1$1 = 0;
    var this$9 = new $c_sc_LinearSeqLike$$anon$1().init___sc_LinearSeqLike(xs$1);
    while (this$9.hasNext__Z()) {
      var arg1$1 = this$9.next__O();
      array$1.u[elem$1$1] = arg1$1;
      elem$1$1 = ((1 + elem$1$1) | 0)
    };
    var jsx$1 = $asArrayOf_Lcom_darkoverlordofdata_entitas_TriggerOnEvent(array$1, 1)
  };
  this.triggers$1 = jsx$1;
  if ($is_Lcom_darkoverlordofdata_entitas_IEnsureComponents(subsystem)) {
    this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undensureComponents$1 = $as_Lcom_darkoverlordofdata_entitas_IEnsureComponents(subsystem).ensureComponents__Lcom_darkoverlordofdata_entitas_IMatcher()
  };
  if ($is_Lcom_darkoverlordofdata_entitas_IExcludeComponents(subsystem)) {
    this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undexcludeComponents$1 = $as_Lcom_darkoverlordofdata_entitas_IExcludeComponents(subsystem).excludeComponents__Lcom_darkoverlordofdata_entitas_IMatcher()
  };
  if ($is_Lcom_darkoverlordofdata_entitas_IClearReactiveSystem(subsystem)) {
    this.$$undclearAfterExecute$1 = true
  };
  this.com$darkoverlordofdata$entitas$ReactiveSystem$$groups$1 = new $c_scm_ListBuffer().init___();
  this.com$darkoverlordofdata$entitas$ReactiveSystem$$eventTypes$1 = new $c_scm_ListBuffer().init___();
  var xs$2 = this.triggers$1;
  var i = 0;
  var len$2 = xs$2.u.length;
  while ((i < len$2)) {
    var index = i;
    var arg1$2 = xs$2.u[index];
    var trigger = $as_Lcom_darkoverlordofdata_entitas_TriggerOnEvent(arg1$2);
    var group = this.pool$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group(trigger.trigger__Lcom_darkoverlordofdata_entitas_Matcher());
    if ((group !== null)) {
      this.com$darkoverlordofdata$entitas$ReactiveSystem$$groups$1.$$plus$eq__O__scm_ListBuffer(group);
      this.com$darkoverlordofdata$entitas$ReactiveSystem$$eventTypes$1.$$plus$eq__O__scm_ListBuffer(trigger.eventType__Lcom_darkoverlordofdata_entitas_GroupEventType$EnumVal())
    };
    i = ((1 + i) | 0)
  };
  var this$14 = this.com$darkoverlordofdata$entitas$ReactiveSystem$$groups$1;
  var this$15 = this$14.scala$collection$mutable$ListBuffer$$start$6;
  var len$3 = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this$15);
  var result = $newArrayObject($d_Lcom_darkoverlordofdata_entitas_Group.getArrayOf(), [len$3]);
  $s_sc_TraversableOnce$class__copyToArray__sc_TraversableOnce__O__I__V(this$15, result, 0);
  var this$17 = this.com$darkoverlordofdata$entitas$ReactiveSystem$$eventTypes$1;
  var this$18 = this$17.scala$collection$mutable$ListBuffer$$start$6;
  var len$4 = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this$18);
  var result$1 = $newArrayObject($d_Lcom_darkoverlordofdata_entitas_GroupEventType$EnumVal.getArrayOf(), [len$4]);
  $s_sc_TraversableOnce$class__copyToArray__sc_TraversableOnce__O__I__V(this$18, result$1, 0);
  this.$$undobserver$1 = new $c_Lcom_darkoverlordofdata_entitas_GroupObserver().init___ALcom_darkoverlordofdata_entitas_Group__ALcom_darkoverlordofdata_entitas_GroupEventType$EnumVal(result, result$1);
  return this
});
$c_Lcom_darkoverlordofdata_entitas_ReactiveSystem.prototype.execute__V = (function() {
  var this$1 = this.$$undobserver$1;
  var collectedEntities = this$1.com$darkoverlordofdata$entitas$GroupObserver$$$undcollectedEntities$1;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(collectedEntities)) {
    if ((this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undensureComponents$1 !== null)) {
      if ((this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undexcludeComponents$1 !== null)) {
        var i = 0;
        var len = collectedEntities.table$5.u.length;
        while ((i < len)) {
          var curEntry = collectedEntities.table$5.u[i];
          if ((curEntry !== null)) {
            var arg1 = $s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O(collectedEntities, curEntry);
            var e = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1);
            if ((this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undensureComponents$1.matches__Lcom_darkoverlordofdata_entitas_Entity__Z(e) && (!this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undexcludeComponents$1.matches__Lcom_darkoverlordofdata_entitas_Entity__Z(e)))) {
              this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undbuffer$1.$$plus$eq__O__scm_ArrayBuffer(e.retain__Lcom_darkoverlordofdata_entitas_Entity())
            }
          };
          i = ((1 + i) | 0)
        }
      } else {
        var i$1 = 0;
        var len$1 = collectedEntities.table$5.u.length;
        while ((i$1 < len$1)) {
          var curEntry$1 = collectedEntities.table$5.u[i$1];
          if ((curEntry$1 !== null)) {
            var arg1$1 = $s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O(collectedEntities, curEntry$1);
            var e$1 = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1$1);
            if (this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undensureComponents$1.matches__Lcom_darkoverlordofdata_entitas_Entity__Z(e$1)) {
              this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undbuffer$1.$$plus$eq__O__scm_ArrayBuffer(e$1.retain__Lcom_darkoverlordofdata_entitas_Entity())
            }
          };
          i$1 = ((1 + i$1) | 0)
        }
      }
    } else if ((this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undexcludeComponents$1 !== null)) {
      var i$2 = 0;
      var len$2 = collectedEntities.table$5.u.length;
      while ((i$2 < len$2)) {
        var curEntry$2 = collectedEntities.table$5.u[i$2];
        if ((curEntry$2 !== null)) {
          var arg1$2 = $s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O(collectedEntities, curEntry$2);
          var e$2 = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1$2);
          if (this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undexcludeComponents$1.matches__Lcom_darkoverlordofdata_entitas_Entity__Z(e$2)) {
            this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undbuffer$1.$$plus$eq__O__scm_ArrayBuffer(e$2.retain__Lcom_darkoverlordofdata_entitas_Entity())
          }
        };
        i$2 = ((1 + i$2) | 0)
      }
    } else {
      var i$3 = 0;
      var len$3 = collectedEntities.table$5.u.length;
      while ((i$3 < len$3)) {
        var curEntry$3 = collectedEntities.table$5.u[i$3];
        if ((curEntry$3 !== null)) {
          var arg1$3 = $s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O(collectedEntities, curEntry$3);
          var e$3 = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1$3);
          this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undbuffer$1.$$plus$eq__O__scm_ArrayBuffer(e$3.retain__Lcom_darkoverlordofdata_entitas_Entity())
        };
        i$3 = ((1 + i$3) | 0)
      }
    }
  };
  this.$$undobserver$1.clearCollectedEntities__V();
  var this$2 = this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undbuffer$1;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$2)) {
    var jsx$1 = this.subsystem$1;
    var this$4 = this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undbuffer$1;
    var len$4 = this$4.size0$6;
    var result = $newArrayObject($d_Lcom_darkoverlordofdata_entitas_Entity.getArrayOf(), [len$4]);
    $s_sc_TraversableOnce$class__copyToArray__sc_TraversableOnce__O__I__V(this$4, result, 0);
    jsx$1.execute__ALcom_darkoverlordofdata_entitas_Entity__V(result);
    var this$5 = this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undbuffer$1;
    var i$4 = 0;
    var top = this$5.size0$6;
    while ((i$4 < top)) {
      var arg1$4 = this$5.array$6.u[i$4];
      var buf = $as_Lcom_darkoverlordofdata_entitas_Entity(arg1$4);
      buf.release__V();
      i$4 = ((1 + i$4) | 0)
    };
    var this$6 = this.com$darkoverlordofdata$entitas$ReactiveSystem$$$undbuffer$1;
    $s_scm_ResizableArray$class__reduceToSize__scm_ResizableArray__I__V(this$6, 0);
    if (this.$$undclearAfterExecute$1) {
      this.$$undobserver$1.clearCollectedEntities__V()
    }
  }
});
function $is_Lcom_darkoverlordofdata_entitas_ReactiveSystem(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_entitas_ReactiveSystem)))
}
function $as_Lcom_darkoverlordofdata_entitas_ReactiveSystem(obj) {
  return (($is_Lcom_darkoverlordofdata_entitas_ReactiveSystem(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.entitas.ReactiveSystem"))
}
function $isArrayOf_Lcom_darkoverlordofdata_entitas_ReactiveSystem(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_entitas_ReactiveSystem)))
}
function $asArrayOf_Lcom_darkoverlordofdata_entitas_ReactiveSystem(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_entitas_ReactiveSystem(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.entitas.ReactiveSystem;", depth))
}
var $d_Lcom_darkoverlordofdata_entitas_ReactiveSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_ReactiveSystem: 0
}, false, "com.darkoverlordofdata.entitas.ReactiveSystem", {
  Lcom_darkoverlordofdata_entitas_ReactiveSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1
});
$c_Lcom_darkoverlordofdata_entitas_ReactiveSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_ReactiveSystem;
/** @constructor */
function $c_Ljava_io_OutputStream() {
  $c_O.call(this)
}
$c_Ljava_io_OutputStream.prototype = new $h_O();
$c_Ljava_io_OutputStream.prototype.constructor = $c_Ljava_io_OutputStream;
/** @constructor */
function $h_Ljava_io_OutputStream() {
  /*<skip>*/
}
$h_Ljava_io_OutputStream.prototype = $c_Ljava_io_OutputStream.prototype;
var $d_jl_Boolean = new $TypeData().initClass({
  jl_Boolean: 0
}, false, "java.lang.Boolean", {
  jl_Boolean: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return ((typeof x) === "boolean")
}));
/** @constructor */
function $c_jl_Character() {
  $c_O.call(this);
  this.value$1 = 0
}
$c_jl_Character.prototype = new $h_O();
$c_jl_Character.prototype.constructor = $c_jl_Character;
/** @constructor */
function $h_jl_Character() {
  /*<skip>*/
}
$h_jl_Character.prototype = $c_jl_Character.prototype;
$c_jl_Character.prototype.equals__O__Z = (function(that) {
  if ($is_jl_Character(that)) {
    var jsx$1 = this.value$1;
    var this$1 = $as_jl_Character(that);
    return (jsx$1 === this$1.value$1)
  } else {
    return false
  }
});
$c_jl_Character.prototype.toString__T = (function() {
  var c = this.value$1;
  return $as_T($g.String.fromCharCode(c))
});
$c_jl_Character.prototype.init___C = (function(value) {
  this.value$1 = value;
  return this
});
$c_jl_Character.prototype.hashCode__I = (function() {
  return this.value$1
});
function $is_jl_Character(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_Character)))
}
function $as_jl_Character(obj) {
  return (($is_jl_Character(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.Character"))
}
function $isArrayOf_jl_Character(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Character)))
}
function $asArrayOf_jl_Character(obj, depth) {
  return (($isArrayOf_jl_Character(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Character;", depth))
}
var $d_jl_Character = new $TypeData().initClass({
  jl_Character: 0
}, false, "java.lang.Character", {
  jl_Character: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
});
$c_jl_Character.prototype.$classData = $d_jl_Character;
/** @constructor */
function $c_jl_Double$() {
  $c_O.call(this);
  this.TYPE$1 = null;
  this.POSITIVE$undINFINITY$1 = 0.0;
  this.NEGATIVE$undINFINITY$1 = 0.0;
  this.NaN$1 = 0.0;
  this.MAX$undVALUE$1 = 0.0;
  this.MIN$undVALUE$1 = 0.0;
  this.MAX$undEXPONENT$1 = 0;
  this.MIN$undEXPONENT$1 = 0;
  this.SIZE$1 = 0;
  this.doubleStrPat$1 = null;
  this.bitmap$0$1 = false
}
$c_jl_Double$.prototype = new $h_O();
$c_jl_Double$.prototype.constructor = $c_jl_Double$;
/** @constructor */
function $h_jl_Double$() {
  /*<skip>*/
}
$h_jl_Double$.prototype = $c_jl_Double$.prototype;
$c_jl_Double$.prototype.init___ = (function() {
  return this
});
$c_jl_Double$.prototype.compare__D__D__I = (function(a, b) {
  if ((a !== a)) {
    return ((b !== b) ? 0 : 1)
  } else if ((b !== b)) {
    return (-1)
  } else if ((a === b)) {
    if ((a === 0.0)) {
      var ainf = (1.0 / a);
      return ((ainf === (1.0 / b)) ? 0 : ((ainf < 0) ? (-1) : 1))
    } else {
      return 0
    }
  } else {
    return ((a < b) ? (-1) : 1)
  }
});
var $d_jl_Double$ = new $TypeData().initClass({
  jl_Double$: 0
}, false, "java.lang.Double$", {
  jl_Double$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_Double$.prototype.$classData = $d_jl_Double$;
var $n_jl_Double$ = (void 0);
function $m_jl_Double$() {
  if ((!$n_jl_Double$)) {
    $n_jl_Double$ = new $c_jl_Double$().init___()
  };
  return $n_jl_Double$
}
/** @constructor */
function $c_jl_Error() {
  $c_jl_Throwable.call(this)
}
$c_jl_Error.prototype = new $h_jl_Throwable();
$c_jl_Error.prototype.constructor = $c_jl_Error;
/** @constructor */
function $h_jl_Error() {
  /*<skip>*/
}
$h_jl_Error.prototype = $c_jl_Error.prototype;
/** @constructor */
function $c_jl_Exception() {
  $c_jl_Throwable.call(this)
}
$c_jl_Exception.prototype = new $h_jl_Throwable();
$c_jl_Exception.prototype.constructor = $c_jl_Exception;
/** @constructor */
function $h_jl_Exception() {
  /*<skip>*/
}
$h_jl_Exception.prototype = $c_jl_Exception.prototype;
$c_jl_Exception.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_Exception = new $TypeData().initClass({
  jl_Exception: 0
}, false, "java.lang.Exception", {
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_Exception.prototype.$classData = $d_jl_Exception;
/** @constructor */
function $c_jl_Integer$() {
  $c_O.call(this);
  this.TYPE$1 = null;
  this.MIN$undVALUE$1 = 0;
  this.MAX$undVALUE$1 = 0;
  this.SIZE$1 = 0;
  this.BYTES$1 = 0
}
$c_jl_Integer$.prototype = new $h_O();
$c_jl_Integer$.prototype.constructor = $c_jl_Integer$;
/** @constructor */
function $h_jl_Integer$() {
  /*<skip>*/
}
$h_jl_Integer$.prototype = $c_jl_Integer$.prototype;
$c_jl_Integer$.prototype.init___ = (function() {
  return this
});
$c_jl_Integer$.prototype.reverseBytes__I__I = (function(i) {
  var byte3 = ((i >>> 24) | 0);
  var byte2 = (65280 & ((i >>> 8) | 0));
  var byte1 = (16711680 & (i << 8));
  var byte0 = (i << 24);
  return (((byte0 | byte1) | byte2) | byte3)
});
$c_jl_Integer$.prototype.bitCount__I__I = (function(i) {
  var t1 = ((i - (1431655765 & (i >> 1))) | 0);
  var t2 = (((858993459 & t1) + (858993459 & (t1 >> 2))) | 0);
  return ($imul(16843009, (252645135 & ((t2 + (t2 >> 4)) | 0))) >> 24)
});
var $d_jl_Integer$ = new $TypeData().initClass({
  jl_Integer$: 0
}, false, "java.lang.Integer$", {
  jl_Integer$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_Integer$.prototype.$classData = $d_jl_Integer$;
var $n_jl_Integer$ = (void 0);
function $m_jl_Integer$() {
  if ((!$n_jl_Integer$)) {
    $n_jl_Integer$ = new $c_jl_Integer$().init___()
  };
  return $n_jl_Integer$
}
/** @constructor */
function $c_ju_Random$() {
  $c_O.call(this)
}
$c_ju_Random$.prototype = new $h_O();
$c_ju_Random$.prototype.constructor = $c_ju_Random$;
/** @constructor */
function $h_ju_Random$() {
  /*<skip>*/
}
$h_ju_Random$.prototype = $c_ju_Random$.prototype;
$c_ju_Random$.prototype.init___ = (function() {
  return this
});
$c_ju_Random$.prototype.java$util$Random$$randomSeed__J = (function() {
  var value = this.randomInt__p1__I();
  var value$1 = this.randomInt__p1__I();
  return new $c_sjsr_RuntimeLong().init___I__I(value$1, value)
});
$c_ju_Random$.prototype.randomInt__p1__I = (function() {
  var a = (4.294967296E9 * $uD($g.Math.random()));
  return $doubleToInt(((-2.147483648E9) + $uD($g.Math.floor(a))))
});
var $d_ju_Random$ = new $TypeData().initClass({
  ju_Random$: 0
}, false, "java.util.Random$", {
  ju_Random$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_ju_Random$.prototype.$classData = $d_ju_Random$;
var $n_ju_Random$ = (void 0);
function $m_ju_Random$() {
  if ((!$n_ju_Random$)) {
    $n_ju_Random$ = new $c_ju_Random$().init___()
  };
  return $n_ju_Random$
}
/** @constructor */
function $c_s_Console$() {
  $c_s_DeprecatedConsole.call(this);
  this.outVar$2 = null;
  this.errVar$2 = null;
  this.inVar$2 = null
}
$c_s_Console$.prototype = new $h_s_DeprecatedConsole();
$c_s_Console$.prototype.constructor = $c_s_Console$;
/** @constructor */
function $h_s_Console$() {
  /*<skip>*/
}
$h_s_Console$.prototype = $c_s_Console$.prototype;
$c_s_Console$.prototype.init___ = (function() {
  $n_s_Console$ = this;
  this.outVar$2 = new $c_s_util_DynamicVariable().init___O($m_jl_System$().out$1);
  this.errVar$2 = new $c_s_util_DynamicVariable().init___O($m_jl_System$().err$1);
  this.inVar$2 = new $c_s_util_DynamicVariable().init___O(null);
  return this
});
var $d_s_Console$ = new $TypeData().initClass({
  s_Console$: 0
}, false, "scala.Console$", {
  s_Console$: 1,
  s_DeprecatedConsole: 1,
  O: 1,
  s_io_AnsiColor: 1
});
$c_s_Console$.prototype.$classData = $d_s_Console$;
var $n_s_Console$ = (void 0);
function $m_s_Console$() {
  if ((!$n_s_Console$)) {
    $n_s_Console$ = new $c_s_Console$().init___()
  };
  return $n_s_Console$
}
/** @constructor */
function $c_s_Enumeration() {
  $c_O.call(this);
  this.scala$Enumeration$$vmap$1 = null;
  this.vset$1 = null;
  this.scala$Enumeration$$vsetDefined$1 = false;
  this.nmap$1 = null;
  this.nextId$1 = 0;
  this.nextName$1 = null;
  this.scala$Enumeration$$topId$1 = 0;
  this.scala$Enumeration$$bottomId$1 = 0;
  this.ValueOrdering$module$1 = null;
  this.ValueSet$module$1 = null
}
$c_s_Enumeration.prototype = new $h_O();
$c_s_Enumeration.prototype.constructor = $c_s_Enumeration;
/** @constructor */
function $h_s_Enumeration() {
  /*<skip>*/
}
$h_s_Enumeration.prototype = $c_s_Enumeration.prototype;
$c_s_Enumeration.prototype.toString__T = (function() {
  var x = $objectGetClass(this).getName__T();
  var this$2 = new $c_sci_StringOps().init___T(x);
  var x$1 = $s_sci_StringLike$class__stripSuffix__sci_StringLike__T__T(this$2, "$");
  var this$4 = new $c_sci_StringOps().init___T(x$1);
  var xs = $s_sci_StringLike$class__split__sci_StringLike__C__AT(this$4, 46);
  var this$6 = new $c_scm_ArrayOps$ofRef().init___AO(xs);
  var x$2 = $as_T($s_sc_IndexedSeqOptimized$class__last__sc_IndexedSeqOptimized__O(this$6));
  var this$8 = new $c_sci_StringOps().init___T(x$2);
  var xs$1 = $s_sci_StringLike$class__split__sci_StringLike__C__AT(this$8, 36);
  var this$10 = new $c_scm_ArrayOps$ofRef().init___AO(xs$1);
  return $as_T($s_sc_IndexedSeqOptimized$class__last__sc_IndexedSeqOptimized__O(this$10))
});
$c_s_Enumeration.prototype.init___I = (function(initial) {
  this.scala$Enumeration$$vmap$1 = new $c_scm_HashMap().init___();
  this.vset$1 = null;
  this.scala$Enumeration$$vsetDefined$1 = false;
  this.nmap$1 = new $c_scm_HashMap().init___();
  this.nextId$1 = initial;
  this.scala$Enumeration$$topId$1 = initial;
  this.scala$Enumeration$$bottomId$1 = ((initial < 0) ? initial : 0);
  return this
});
/** @constructor */
function $c_s_Predef$() {
  $c_s_LowPriorityImplicits.call(this);
  this.Map$2 = null;
  this.Set$2 = null;
  this.ClassManifest$2 = null;
  this.Manifest$2 = null;
  this.NoManifest$2 = null;
  this.StringCanBuildFrom$2 = null;
  this.singleton$und$less$colon$less$2 = null;
  this.scala$Predef$$singleton$und$eq$colon$eq$f = null
}
$c_s_Predef$.prototype = new $h_s_LowPriorityImplicits();
$c_s_Predef$.prototype.constructor = $c_s_Predef$;
/** @constructor */
function $h_s_Predef$() {
  /*<skip>*/
}
$h_s_Predef$.prototype = $c_s_Predef$.prototype;
$c_s_Predef$.prototype.init___ = (function() {
  $n_s_Predef$ = this;
  $m_s_package$();
  $m_sci_List$();
  this.Map$2 = $m_sci_Map$();
  this.Set$2 = $m_sci_Set$();
  this.ClassManifest$2 = $m_s_reflect_package$().ClassManifest$1;
  this.Manifest$2 = $m_s_reflect_package$().Manifest$1;
  this.NoManifest$2 = $m_s_reflect_NoManifest$();
  this.StringCanBuildFrom$2 = new $c_s_Predef$$anon$3().init___();
  this.singleton$und$less$colon$less$2 = new $c_s_Predef$$anon$1().init___();
  this.scala$Predef$$singleton$und$eq$colon$eq$f = new $c_s_Predef$$anon$2().init___();
  return this
});
$c_s_Predef$.prototype.assert__Z__V = (function(assertion) {
  if ((!assertion)) {
    throw new $c_jl_AssertionError().init___O("assertion failed")
  }
});
$c_s_Predef$.prototype.require__Z__V = (function(requirement) {
  if ((!requirement)) {
    throw new $c_jl_IllegalArgumentException().init___T("requirement failed")
  }
});
var $d_s_Predef$ = new $TypeData().initClass({
  s_Predef$: 0
}, false, "scala.Predef$", {
  s_Predef$: 1,
  s_LowPriorityImplicits: 1,
  O: 1,
  s_DeprecatedPredef: 1
});
$c_s_Predef$.prototype.$classData = $d_s_Predef$;
var $n_s_Predef$ = (void 0);
function $m_s_Predef$() {
  if ((!$n_s_Predef$)) {
    $n_s_Predef$ = new $c_s_Predef$().init___()
  };
  return $n_s_Predef$
}
/** @constructor */
function $c_s_StringContext$() {
  $c_O.call(this)
}
$c_s_StringContext$.prototype = new $h_O();
$c_s_StringContext$.prototype.constructor = $c_s_StringContext$;
/** @constructor */
function $h_s_StringContext$() {
  /*<skip>*/
}
$h_s_StringContext$.prototype = $c_s_StringContext$.prototype;
$c_s_StringContext$.prototype.init___ = (function() {
  return this
});
$c_s_StringContext$.prototype.treatEscapes0__p1__T__Z__T = (function(str, strict) {
  var len = $uI(str.length);
  var x1 = $m_sjsr_RuntimeString$().indexOf__T__I__I(str, 92);
  switch (x1) {
    case (-1): {
      return str;
      break
    }
    default: {
      return this.replace$1__p1__I__T__Z__I__T(x1, str, strict, len)
    }
  }
});
$c_s_StringContext$.prototype.loop$1__p1__I__I__T__Z__I__jl_StringBuilder__T = (function(i, next, str$1, strict$1, len$1, b$1) {
  _loop: while (true) {
    if ((next >= 0)) {
      if ((next > i)) {
        b$1.append__jl_CharSequence__I__I__jl_StringBuilder(str$1, i, next)
      };
      var idx = ((1 + next) | 0);
      if ((idx >= len$1)) {
        throw new $c_s_StringContext$InvalidEscapeException().init___T__I(str$1, next)
      };
      var index = idx;
      var x1 = (65535 & $uI(str$1.charCodeAt(index)));
      switch (x1) {
        case 98: {
          var c = 8;
          break
        }
        case 116: {
          var c = 9;
          break
        }
        case 110: {
          var c = 10;
          break
        }
        case 102: {
          var c = 12;
          break
        }
        case 114: {
          var c = 13;
          break
        }
        case 34: {
          var c = 34;
          break
        }
        case 39: {
          var c = 39;
          break
        }
        case 92: {
          var c = 92;
          break
        }
        default: {
          if (((x1 >= 48) && (x1 <= 55))) {
            if (strict$1) {
              throw new $c_s_StringContext$InvalidEscapeException().init___T__I(str$1, next)
            };
            var index$1 = idx;
            var leadch = (65535 & $uI(str$1.charCodeAt(index$1)));
            var oct = (((-48) + leadch) | 0);
            idx = ((1 + idx) | 0);
            if ((idx < len$1)) {
              var index$2 = idx;
              var jsx$2 = ((65535 & $uI(str$1.charCodeAt(index$2))) >= 48)
            } else {
              var jsx$2 = false
            };
            if (jsx$2) {
              var index$3 = idx;
              var jsx$1 = ((65535 & $uI(str$1.charCodeAt(index$3))) <= 55)
            } else {
              var jsx$1 = false
            };
            if (jsx$1) {
              var jsx$3 = oct;
              var index$4 = idx;
              oct = (((-48) + (((jsx$3 << 3) + (65535 & $uI(str$1.charCodeAt(index$4)))) | 0)) | 0);
              idx = ((1 + idx) | 0);
              if (((idx < len$1) && (leadch <= 51))) {
                var index$5 = idx;
                var jsx$5 = ((65535 & $uI(str$1.charCodeAt(index$5))) >= 48)
              } else {
                var jsx$5 = false
              };
              if (jsx$5) {
                var index$6 = idx;
                var jsx$4 = ((65535 & $uI(str$1.charCodeAt(index$6))) <= 55)
              } else {
                var jsx$4 = false
              };
              if (jsx$4) {
                var jsx$6 = oct;
                var index$7 = idx;
                oct = (((-48) + (((jsx$6 << 3) + (65535 & $uI(str$1.charCodeAt(index$7)))) | 0)) | 0);
                idx = ((1 + idx) | 0)
              }
            };
            idx = (((-1) + idx) | 0);
            var c = (65535 & oct)
          } else {
            var c;
            throw new $c_s_StringContext$InvalidEscapeException().init___T__I(str$1, next)
          }
        }
      };
      idx = ((1 + idx) | 0);
      b$1.append__C__jl_StringBuilder(c);
      var temp$i = idx;
      var temp$next = $m_sjsr_RuntimeString$().indexOf__T__I__I__I(str$1, 92, idx);
      i = temp$i;
      next = temp$next;
      continue _loop
    } else {
      if ((i < len$1)) {
        b$1.append__jl_CharSequence__I__I__jl_StringBuilder(str$1, i, len$1)
      };
      return b$1.content$1
    }
  }
});
$c_s_StringContext$.prototype.replace$1__p1__I__T__Z__I__T = (function(first, str$1, strict$1, len$1) {
  var b = new $c_jl_StringBuilder().init___();
  return this.loop$1__p1__I__I__T__Z__I__jl_StringBuilder__T(0, first, str$1, strict$1, len$1, b)
});
var $d_s_StringContext$ = new $TypeData().initClass({
  s_StringContext$: 0
}, false, "scala.StringContext$", {
  s_StringContext$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_StringContext$.prototype.$classData = $d_s_StringContext$;
var $n_s_StringContext$ = (void 0);
function $m_s_StringContext$() {
  if ((!$n_s_StringContext$)) {
    $n_s_StringContext$ = new $c_s_StringContext$().init___()
  };
  return $n_s_StringContext$
}
/** @constructor */
function $c_s_math_Fractional$() {
  $c_O.call(this)
}
$c_s_math_Fractional$.prototype = new $h_O();
$c_s_math_Fractional$.prototype.constructor = $c_s_math_Fractional$;
/** @constructor */
function $h_s_math_Fractional$() {
  /*<skip>*/
}
$h_s_math_Fractional$.prototype = $c_s_math_Fractional$.prototype;
$c_s_math_Fractional$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Fractional$ = new $TypeData().initClass({
  s_math_Fractional$: 0
}, false, "scala.math.Fractional$", {
  s_math_Fractional$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Fractional$.prototype.$classData = $d_s_math_Fractional$;
var $n_s_math_Fractional$ = (void 0);
function $m_s_math_Fractional$() {
  if ((!$n_s_math_Fractional$)) {
    $n_s_math_Fractional$ = new $c_s_math_Fractional$().init___()
  };
  return $n_s_math_Fractional$
}
/** @constructor */
function $c_s_math_Integral$() {
  $c_O.call(this)
}
$c_s_math_Integral$.prototype = new $h_O();
$c_s_math_Integral$.prototype.constructor = $c_s_math_Integral$;
/** @constructor */
function $h_s_math_Integral$() {
  /*<skip>*/
}
$h_s_math_Integral$.prototype = $c_s_math_Integral$.prototype;
$c_s_math_Integral$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Integral$ = new $TypeData().initClass({
  s_math_Integral$: 0
}, false, "scala.math.Integral$", {
  s_math_Integral$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Integral$.prototype.$classData = $d_s_math_Integral$;
var $n_s_math_Integral$ = (void 0);
function $m_s_math_Integral$() {
  if ((!$n_s_math_Integral$)) {
    $n_s_math_Integral$ = new $c_s_math_Integral$().init___()
  };
  return $n_s_math_Integral$
}
/** @constructor */
function $c_s_math_Numeric$() {
  $c_O.call(this)
}
$c_s_math_Numeric$.prototype = new $h_O();
$c_s_math_Numeric$.prototype.constructor = $c_s_math_Numeric$;
/** @constructor */
function $h_s_math_Numeric$() {
  /*<skip>*/
}
$h_s_math_Numeric$.prototype = $c_s_math_Numeric$.prototype;
$c_s_math_Numeric$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Numeric$ = new $TypeData().initClass({
  s_math_Numeric$: 0
}, false, "scala.math.Numeric$", {
  s_math_Numeric$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Numeric$.prototype.$classData = $d_s_math_Numeric$;
var $n_s_math_Numeric$ = (void 0);
function $m_s_math_Numeric$() {
  if ((!$n_s_math_Numeric$)) {
    $n_s_math_Numeric$ = new $c_s_math_Numeric$().init___()
  };
  return $n_s_math_Numeric$
}
function $is_s_math_ScalaNumber(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_math_ScalaNumber)))
}
function $as_s_math_ScalaNumber(obj) {
  return (($is_s_math_ScalaNumber(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.math.ScalaNumber"))
}
function $isArrayOf_s_math_ScalaNumber(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_math_ScalaNumber)))
}
function $asArrayOf_s_math_ScalaNumber(obj, depth) {
  return (($isArrayOf_s_math_ScalaNumber(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.math.ScalaNumber;", depth))
}
/** @constructor */
function $c_s_reflect_ClassTag$() {
  $c_O.call(this)
}
$c_s_reflect_ClassTag$.prototype = new $h_O();
$c_s_reflect_ClassTag$.prototype.constructor = $c_s_reflect_ClassTag$;
/** @constructor */
function $h_s_reflect_ClassTag$() {
  /*<skip>*/
}
$h_s_reflect_ClassTag$.prototype = $c_s_reflect_ClassTag$.prototype;
$c_s_reflect_ClassTag$.prototype.init___ = (function() {
  return this
});
$c_s_reflect_ClassTag$.prototype.apply__jl_Class__s_reflect_ClassTag = (function(runtimeClass1) {
  return ((runtimeClass1 === $d_B.getClassOf()) ? $m_s_reflect_ManifestFactory$ByteManifest$() : ((runtimeClass1 === $d_S.getClassOf()) ? $m_s_reflect_ManifestFactory$ShortManifest$() : ((runtimeClass1 === $d_C.getClassOf()) ? $m_s_reflect_ManifestFactory$CharManifest$() : ((runtimeClass1 === $d_I.getClassOf()) ? $m_s_reflect_ManifestFactory$IntManifest$() : ((runtimeClass1 === $d_J.getClassOf()) ? $m_s_reflect_ManifestFactory$LongManifest$() : ((runtimeClass1 === $d_F.getClassOf()) ? $m_s_reflect_ManifestFactory$FloatManifest$() : ((runtimeClass1 === $d_D.getClassOf()) ? $m_s_reflect_ManifestFactory$DoubleManifest$() : ((runtimeClass1 === $d_Z.getClassOf()) ? $m_s_reflect_ManifestFactory$BooleanManifest$() : ((runtimeClass1 === $d_V.getClassOf()) ? $m_s_reflect_ManifestFactory$UnitManifest$() : ((runtimeClass1 === $d_O.getClassOf()) ? $m_s_reflect_ManifestFactory$ObjectManifest$() : ((runtimeClass1 === $d_sr_Nothing$.getClassOf()) ? $m_s_reflect_ManifestFactory$NothingManifest$() : ((runtimeClass1 === $d_sr_Null$.getClassOf()) ? $m_s_reflect_ManifestFactory$NullManifest$() : new $c_s_reflect_ClassTag$ClassClassTag().init___jl_Class(runtimeClass1)))))))))))))
});
var $d_s_reflect_ClassTag$ = new $TypeData().initClass({
  s_reflect_ClassTag$: 0
}, false, "scala.reflect.ClassTag$", {
  s_reflect_ClassTag$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_reflect_ClassTag$.prototype.$classData = $d_s_reflect_ClassTag$;
var $n_s_reflect_ClassTag$ = (void 0);
function $m_s_reflect_ClassTag$() {
  if ((!$n_s_reflect_ClassTag$)) {
    $n_s_reflect_ClassTag$ = new $c_s_reflect_ClassTag$().init___()
  };
  return $n_s_reflect_ClassTag$
}
/** @constructor */
function $c_s_util_Left$() {
  $c_O.call(this)
}
$c_s_util_Left$.prototype = new $h_O();
$c_s_util_Left$.prototype.constructor = $c_s_util_Left$;
/** @constructor */
function $h_s_util_Left$() {
  /*<skip>*/
}
$h_s_util_Left$.prototype = $c_s_util_Left$.prototype;
$c_s_util_Left$.prototype.init___ = (function() {
  return this
});
$c_s_util_Left$.prototype.toString__T = (function() {
  return "Left"
});
var $d_s_util_Left$ = new $TypeData().initClass({
  s_util_Left$: 0
}, false, "scala.util.Left$", {
  s_util_Left$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Left$.prototype.$classData = $d_s_util_Left$;
var $n_s_util_Left$ = (void 0);
function $m_s_util_Left$() {
  if ((!$n_s_util_Left$)) {
    $n_s_util_Left$ = new $c_s_util_Left$().init___()
  };
  return $n_s_util_Left$
}
/** @constructor */
function $c_s_util_Right$() {
  $c_O.call(this)
}
$c_s_util_Right$.prototype = new $h_O();
$c_s_util_Right$.prototype.constructor = $c_s_util_Right$;
/** @constructor */
function $h_s_util_Right$() {
  /*<skip>*/
}
$h_s_util_Right$.prototype = $c_s_util_Right$.prototype;
$c_s_util_Right$.prototype.init___ = (function() {
  return this
});
$c_s_util_Right$.prototype.toString__T = (function() {
  return "Right"
});
var $d_s_util_Right$ = new $TypeData().initClass({
  s_util_Right$: 0
}, false, "scala.util.Right$", {
  s_util_Right$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_Right$.prototype.$classData = $d_s_util_Right$;
var $n_s_util_Right$ = (void 0);
function $m_s_util_Right$() {
  if ((!$n_s_util_Right$)) {
    $n_s_util_Right$ = new $c_s_util_Right$().init___()
  };
  return $n_s_util_Right$
}
/** @constructor */
function $c_s_util_control_NoStackTrace$() {
  $c_O.call(this);
  this.$$undnoSuppression$1 = false
}
$c_s_util_control_NoStackTrace$.prototype = new $h_O();
$c_s_util_control_NoStackTrace$.prototype.constructor = $c_s_util_control_NoStackTrace$;
/** @constructor */
function $h_s_util_control_NoStackTrace$() {
  /*<skip>*/
}
$h_s_util_control_NoStackTrace$.prototype = $c_s_util_control_NoStackTrace$.prototype;
$c_s_util_control_NoStackTrace$.prototype.init___ = (function() {
  this.$$undnoSuppression$1 = false;
  return this
});
var $d_s_util_control_NoStackTrace$ = new $TypeData().initClass({
  s_util_control_NoStackTrace$: 0
}, false, "scala.util.control.NoStackTrace$", {
  s_util_control_NoStackTrace$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_util_control_NoStackTrace$.prototype.$classData = $d_s_util_control_NoStackTrace$;
var $n_s_util_control_NoStackTrace$ = (void 0);
function $m_s_util_control_NoStackTrace$() {
  if ((!$n_s_util_control_NoStackTrace$)) {
    $n_s_util_control_NoStackTrace$ = new $c_s_util_control_NoStackTrace$().init___()
  };
  return $n_s_util_control_NoStackTrace$
}
/** @constructor */
function $c_sc_IndexedSeq$$anon$1() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this)
}
$c_sc_IndexedSeq$$anon$1.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_sc_IndexedSeq$$anon$1.prototype.constructor = $c_sc_IndexedSeq$$anon$1;
/** @constructor */
function $h_sc_IndexedSeq$$anon$1() {
  /*<skip>*/
}
$h_sc_IndexedSeq$$anon$1.prototype = $c_sc_IndexedSeq$$anon$1.prototype;
$c_sc_IndexedSeq$$anon$1.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $m_sc_IndexedSeq$());
  return this
});
$c_sc_IndexedSeq$$anon$1.prototype.apply__scm_Builder = (function() {
  $m_sc_IndexedSeq$();
  $m_sci_IndexedSeq$();
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sc_IndexedSeq$$anon$1 = new $TypeData().initClass({
  sc_IndexedSeq$$anon$1: 0
}, false, "scala.collection.IndexedSeq$$anon$1", {
  sc_IndexedSeq$$anon$1: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_sc_IndexedSeq$$anon$1.prototype.$classData = $d_sc_IndexedSeq$$anon$1;
/** @constructor */
function $c_scg_GenSeqFactory() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_scg_GenSeqFactory.prototype = new $h_scg_GenTraversableFactory();
$c_scg_GenSeqFactory.prototype.constructor = $c_scg_GenSeqFactory;
/** @constructor */
function $h_scg_GenSeqFactory() {
  /*<skip>*/
}
$h_scg_GenSeqFactory.prototype = $c_scg_GenSeqFactory.prototype;
/** @constructor */
function $c_scg_GenTraversableFactory$$anon$1() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this);
  this.$$outer$2 = null
}
$c_scg_GenTraversableFactory$$anon$1.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_scg_GenTraversableFactory$$anon$1.prototype.constructor = $c_scg_GenTraversableFactory$$anon$1;
/** @constructor */
function $h_scg_GenTraversableFactory$$anon$1() {
  /*<skip>*/
}
$h_scg_GenTraversableFactory$$anon$1.prototype = $c_scg_GenTraversableFactory$$anon$1.prototype;
$c_scg_GenTraversableFactory$$anon$1.prototype.apply__scm_Builder = (function() {
  return this.$$outer$2.newBuilder__scm_Builder()
});
$c_scg_GenTraversableFactory$$anon$1.prototype.init___scg_GenTraversableFactory = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $$outer);
  return this
});
var $d_scg_GenTraversableFactory$$anon$1 = new $TypeData().initClass({
  scg_GenTraversableFactory$$anon$1: 0
}, false, "scala.collection.generic.GenTraversableFactory$$anon$1", {
  scg_GenTraversableFactory$$anon$1: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_scg_GenTraversableFactory$$anon$1.prototype.$classData = $d_scg_GenTraversableFactory$$anon$1;
/** @constructor */
function $c_scg_ImmutableMapFactory() {
  $c_scg_MapFactory.call(this)
}
$c_scg_ImmutableMapFactory.prototype = new $h_scg_MapFactory();
$c_scg_ImmutableMapFactory.prototype.constructor = $c_scg_ImmutableMapFactory;
/** @constructor */
function $h_scg_ImmutableMapFactory() {
  /*<skip>*/
}
$h_scg_ImmutableMapFactory.prototype = $c_scg_ImmutableMapFactory.prototype;
/** @constructor */
function $c_sci_$colon$colon$() {
  $c_O.call(this)
}
$c_sci_$colon$colon$.prototype = new $h_O();
$c_sci_$colon$colon$.prototype.constructor = $c_sci_$colon$colon$;
/** @constructor */
function $h_sci_$colon$colon$() {
  /*<skip>*/
}
$h_sci_$colon$colon$.prototype = $c_sci_$colon$colon$.prototype;
$c_sci_$colon$colon$.prototype.init___ = (function() {
  return this
});
$c_sci_$colon$colon$.prototype.toString__T = (function() {
  return "::"
});
var $d_sci_$colon$colon$ = new $TypeData().initClass({
  sci_$colon$colon$: 0
}, false, "scala.collection.immutable.$colon$colon$", {
  sci_$colon$colon$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_$colon$colon$.prototype.$classData = $d_sci_$colon$colon$;
var $n_sci_$colon$colon$ = (void 0);
function $m_sci_$colon$colon$() {
  if ((!$n_sci_$colon$colon$)) {
    $n_sci_$colon$colon$ = new $c_sci_$colon$colon$().init___()
  };
  return $n_sci_$colon$colon$
}
/** @constructor */
function $c_sci_Range$() {
  $c_O.call(this);
  this.MAX$undPRINT$1 = 0
}
$c_sci_Range$.prototype = new $h_O();
$c_sci_Range$.prototype.constructor = $c_sci_Range$;
/** @constructor */
function $h_sci_Range$() {
  /*<skip>*/
}
$h_sci_Range$.prototype = $c_sci_Range$.prototype;
$c_sci_Range$.prototype.init___ = (function() {
  this.MAX$undPRINT$1 = 512;
  return this
});
$c_sci_Range$.prototype.description__p1__I__I__I__Z__T = (function(start, end, step, isInclusive) {
  return ((((start + (isInclusive ? " to " : " until ")) + end) + " by ") + step)
});
$c_sci_Range$.prototype.scala$collection$immutable$Range$$fail__I__I__I__Z__sr_Nothing$ = (function(start, end, step, isInclusive) {
  throw new $c_jl_IllegalArgumentException().init___T((this.description__p1__I__I__I__Z__T(start, end, step, isInclusive) + ": seqs cannot contain more than Int.MaxValue elements."))
});
var $d_sci_Range$ = new $TypeData().initClass({
  sci_Range$: 0
}, false, "scala.collection.immutable.Range$", {
  sci_Range$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Range$.prototype.$classData = $d_sci_Range$;
var $n_sci_Range$ = (void 0);
function $m_sci_Range$() {
  if ((!$n_sci_Range$)) {
    $n_sci_Range$ = new $c_sci_Range$().init___()
  };
  return $n_sci_Range$
}
/** @constructor */
function $c_sci_Stream$StreamCanBuildFrom() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.call(this)
}
$c_sci_Stream$StreamCanBuildFrom.prototype = new $h_scg_GenTraversableFactory$GenericCanBuildFrom();
$c_sci_Stream$StreamCanBuildFrom.prototype.constructor = $c_sci_Stream$StreamCanBuildFrom;
/** @constructor */
function $h_sci_Stream$StreamCanBuildFrom() {
  /*<skip>*/
}
$h_sci_Stream$StreamCanBuildFrom.prototype = $c_sci_Stream$StreamCanBuildFrom.prototype;
$c_sci_Stream$StreamCanBuildFrom.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory$GenericCanBuildFrom.prototype.init___scg_GenTraversableFactory.call(this, $m_sci_Stream$());
  return this
});
var $d_sci_Stream$StreamCanBuildFrom = new $TypeData().initClass({
  sci_Stream$StreamCanBuildFrom: 0
}, false, "scala.collection.immutable.Stream$StreamCanBuildFrom", {
  sci_Stream$StreamCanBuildFrom: 1,
  scg_GenTraversableFactory$GenericCanBuildFrom: 1,
  O: 1,
  scg_CanBuildFrom: 1
});
$c_sci_Stream$StreamCanBuildFrom.prototype.$classData = $d_sci_Stream$StreamCanBuildFrom;
/** @constructor */
function $c_scm_StringBuilder$() {
  $c_O.call(this)
}
$c_scm_StringBuilder$.prototype = new $h_O();
$c_scm_StringBuilder$.prototype.constructor = $c_scm_StringBuilder$;
/** @constructor */
function $h_scm_StringBuilder$() {
  /*<skip>*/
}
$h_scm_StringBuilder$.prototype = $c_scm_StringBuilder$.prototype;
$c_scm_StringBuilder$.prototype.init___ = (function() {
  return this
});
var $d_scm_StringBuilder$ = new $TypeData().initClass({
  scm_StringBuilder$: 0
}, false, "scala.collection.mutable.StringBuilder$", {
  scm_StringBuilder$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_StringBuilder$.prototype.$classData = $d_scm_StringBuilder$;
var $n_scm_StringBuilder$ = (void 0);
function $m_scm_StringBuilder$() {
  if ((!$n_scm_StringBuilder$)) {
    $n_scm_StringBuilder$ = new $c_scm_StringBuilder$().init___()
  };
  return $n_scm_StringBuilder$
}
/** @constructor */
function $c_sjsr_AnonFunction0() {
  $c_sr_AbstractFunction0.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction0.prototype = new $h_sr_AbstractFunction0();
$c_sjsr_AnonFunction0.prototype.constructor = $c_sjsr_AnonFunction0;
/** @constructor */
function $h_sjsr_AnonFunction0() {
  /*<skip>*/
}
$h_sjsr_AnonFunction0.prototype = $c_sjsr_AnonFunction0.prototype;
$c_sjsr_AnonFunction0.prototype.apply__O = (function() {
  return (0, this.f$2)()
});
$c_sjsr_AnonFunction0.prototype.init___sjs_js_Function0 = (function(f) {
  this.f$2 = f;
  return this
});
var $d_sjsr_AnonFunction0 = new $TypeData().initClass({
  sjsr_AnonFunction0: 0
}, false, "scala.scalajs.runtime.AnonFunction0", {
  sjsr_AnonFunction0: 1,
  sr_AbstractFunction0: 1,
  O: 1,
  F0: 1
});
$c_sjsr_AnonFunction0.prototype.$classData = $d_sjsr_AnonFunction0;
/** @constructor */
function $c_sjsr_AnonFunction1() {
  $c_sr_AbstractFunction1.call(this);
  this.f$2 = null
}
$c_sjsr_AnonFunction1.prototype = new $h_sr_AbstractFunction1();
$c_sjsr_AnonFunction1.prototype.constructor = $c_sjsr_AnonFunction1;
/** @constructor */
function $h_sjsr_AnonFunction1() {
  /*<skip>*/
}
$h_sjsr_AnonFunction1.prototype = $c_sjsr_AnonFunction1.prototype;
$c_sjsr_AnonFunction1.prototype.apply__O__O = (function(arg1) {
  return (0, this.f$2)(arg1)
});
$c_sjsr_AnonFunction1.prototype.init___sjs_js_Function1 = (function(f) {
  this.f$2 = f;
  return this
});
var $d_sjsr_AnonFunction1 = new $TypeData().initClass({
  sjsr_AnonFunction1: 0
}, false, "scala.scalajs.runtime.AnonFunction1", {
  sjsr_AnonFunction1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1
});
$c_sjsr_AnonFunction1.prototype.$classData = $d_sjsr_AnonFunction1;
/** @constructor */
function $c_sjsr_RuntimeLong$() {
  $c_O.call(this);
  this.TwoPow32$1 = 0.0;
  this.TwoPow63$1 = 0.0;
  this.UnsignedSafeDoubleHiMask$1 = 0;
  this.AskQuotient$1 = 0;
  this.AskRemainder$1 = 0;
  this.AskBoth$1 = 0;
  this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
  this.Zero$1 = null
}
$c_sjsr_RuntimeLong$.prototype = new $h_O();
$c_sjsr_RuntimeLong$.prototype.constructor = $c_sjsr_RuntimeLong$;
/** @constructor */
function $h_sjsr_RuntimeLong$() {
  /*<skip>*/
}
$h_sjsr_RuntimeLong$.prototype = $c_sjsr_RuntimeLong$.prototype;
$c_sjsr_RuntimeLong$.prototype.init___ = (function() {
  $n_sjsr_RuntimeLong$ = this;
  this.Zero$1 = new $c_sjsr_RuntimeLong().init___I__I(0, 0);
  return this
});
$c_sjsr_RuntimeLong$.prototype.Zero__sjsr_RuntimeLong = (function() {
  return this.Zero$1
});
$c_sjsr_RuntimeLong$.prototype.toUnsignedString__p1__I__I__T = (function(lo, hi) {
  if ((((-2097152) & hi) === 0)) {
    var this$5 = ((4.294967296E9 * hi) + $uD((lo >>> 0)));
    return ("" + this$5)
  } else {
    var quotRem = this.unsignedDivModHelper__p1__I__I__I__I__I__sjs_js_$bar(lo, hi, 1000000000, 0, 2);
    var quotLo = $uI(quotRem["0"]);
    var quotHi = $uI(quotRem["1"]);
    var rem = $uI(quotRem["2"]);
    var quot = ((4.294967296E9 * quotHi) + $uD((quotLo >>> 0)));
    var remStr = ("" + rem);
    return ((("" + quot) + $as_T("000000000".substring($uI(remStr.length)))) + remStr)
  }
});
$c_sjsr_RuntimeLong$.prototype.divideImpl__I__I__I__I__I = (function(alo, ahi, blo, bhi) {
  if (((blo | bhi) === 0)) {
    throw new $c_jl_ArithmeticException().init___T("/ by zero")
  };
  if ((ahi === (alo >> 31))) {
    if ((bhi === (blo >> 31))) {
      if (((alo === (-2147483648)) && (blo === (-1)))) {
        this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
        return (-2147483648)
      } else {
        var lo = ((alo / blo) | 0);
        this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (lo >> 31);
        return lo
      }
    } else if (((alo === (-2147483648)) && ((blo === (-2147483648)) && (bhi === 0)))) {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (-1);
      return (-1)
    } else {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
      return 0
    }
  } else {
    var neg = (ahi < 0);
    if (neg) {
      var lo$1 = ((-alo) | 0);
      var hi = ((alo !== 0) ? (~ahi) : ((-ahi) | 0));
      var abs_$_lo$2 = lo$1;
      var abs_$_hi$2 = hi
    } else {
      var abs_$_lo$2 = alo;
      var abs_$_hi$2 = ahi
    };
    var neg$1 = (bhi < 0);
    if (neg$1) {
      var lo$2 = ((-blo) | 0);
      var hi$1 = ((blo !== 0) ? (~bhi) : ((-bhi) | 0));
      var abs$1_$_lo$2 = lo$2;
      var abs$1_$_hi$2 = hi$1
    } else {
      var abs$1_$_lo$2 = blo;
      var abs$1_$_hi$2 = bhi
    };
    var absRLo = this.unsigned$und$div__p1__I__I__I__I__I(abs_$_lo$2, abs_$_hi$2, abs$1_$_lo$2, abs$1_$_hi$2);
    if ((neg === neg$1)) {
      return absRLo
    } else {
      var hi$2 = this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f;
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = ((absRLo !== 0) ? (~hi$2) : ((-hi$2) | 0));
      return ((-absRLo) | 0)
    }
  }
});
$c_sjsr_RuntimeLong$.prototype.scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D = (function(lo, hi) {
  if ((hi < 0)) {
    var x = ((lo !== 0) ? (~hi) : ((-hi) | 0));
    var jsx$1 = $uD((x >>> 0));
    var x$1 = ((-lo) | 0);
    return (-((4.294967296E9 * jsx$1) + $uD((x$1 >>> 0))))
  } else {
    return ((4.294967296E9 * hi) + $uD((lo >>> 0)))
  }
});
$c_sjsr_RuntimeLong$.prototype.fromDouble__D__sjsr_RuntimeLong = (function(value) {
  var lo = this.scala$scalajs$runtime$RuntimeLong$$fromDoubleImpl__D__I(value);
  return new $c_sjsr_RuntimeLong().init___I__I(lo, this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f)
});
$c_sjsr_RuntimeLong$.prototype.scala$scalajs$runtime$RuntimeLong$$fromDoubleImpl__D__I = (function(value) {
  if ((value < (-9.223372036854776E18))) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (-2147483648);
    return 0
  } else if ((value >= 9.223372036854776E18)) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 2147483647;
    return (-1)
  } else {
    var rawLo = $uI((value | 0));
    var x = (value / 4.294967296E9);
    var rawHi = $uI((x | 0));
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (((value < 0) && (rawLo !== 0)) ? (((-1) + rawHi) | 0) : rawHi);
    return rawLo
  }
});
$c_sjsr_RuntimeLong$.prototype.unsigned$und$div__p1__I__I__I__I__I = (function(alo, ahi, blo, bhi) {
  if ((((-2097152) & ahi) === 0)) {
    if ((((-2097152) & bhi) === 0)) {
      var aDouble = ((4.294967296E9 * ahi) + $uD((alo >>> 0)));
      var bDouble = ((4.294967296E9 * bhi) + $uD((blo >>> 0)));
      var rDouble = (aDouble / bDouble);
      var x = (rDouble / 4.294967296E9);
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = $uI((x | 0));
      return $uI((rDouble | 0))
    } else {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
      return 0
    }
  } else if (((bhi === 0) && ((blo & (((-1) + blo) | 0)) === 0))) {
    var pow = ((31 - $clz32(blo)) | 0);
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = ((ahi >>> pow) | 0);
    return (((alo >>> pow) | 0) | ((ahi << 1) << ((31 - pow) | 0)))
  } else if (((blo === 0) && ((bhi & (((-1) + bhi) | 0)) === 0))) {
    var pow$2 = ((31 - $clz32(bhi)) | 0);
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
    return ((ahi >>> pow$2) | 0)
  } else {
    return $uI(this.unsignedDivModHelper__p1__I__I__I__I__I__sjs_js_$bar(alo, ahi, blo, bhi, 0))
  }
});
$c_sjsr_RuntimeLong$.prototype.scala$scalajs$runtime$RuntimeLong$$toString__I__I__T = (function(lo, hi) {
  return ((hi === (lo >> 31)) ? ("" + lo) : ((hi < 0) ? ("-" + this.toUnsignedString__p1__I__I__T(((-lo) | 0), ((lo !== 0) ? (~hi) : ((-hi) | 0)))) : this.toUnsignedString__p1__I__I__T(lo, hi)))
});
$c_sjsr_RuntimeLong$.prototype.scala$scalajs$runtime$RuntimeLong$$compare__I__I__I__I__I = (function(alo, ahi, blo, bhi) {
  return ((ahi === bhi) ? ((alo === blo) ? 0 : ((((-2147483648) ^ alo) < ((-2147483648) ^ blo)) ? (-1) : 1)) : ((ahi < bhi) ? (-1) : 1))
});
$c_sjsr_RuntimeLong$.prototype.unsignedDivModHelper__p1__I__I__I__I__I__sjs_js_$bar = (function(alo, ahi, blo, bhi, ask) {
  var shift = ((((bhi !== 0) ? $clz32(bhi) : ((32 + $clz32(blo)) | 0)) - ((ahi !== 0) ? $clz32(ahi) : ((32 + $clz32(alo)) | 0))) | 0);
  var n = shift;
  var lo = (((32 & n) === 0) ? (blo << n) : 0);
  var hi = (((32 & n) === 0) ? (((((blo >>> 1) | 0) >>> ((31 - n) | 0)) | 0) | (bhi << n)) : (blo << n));
  var bShiftLo = lo;
  var bShiftHi = hi;
  var remLo = alo;
  var remHi = ahi;
  var quotLo = 0;
  var quotHi = 0;
  while (((shift >= 0) && (((-2097152) & remHi) !== 0))) {
    var alo$1 = remLo;
    var ahi$1 = remHi;
    var blo$1 = bShiftLo;
    var bhi$1 = bShiftHi;
    if (((ahi$1 === bhi$1) ? (((-2147483648) ^ alo$1) >= ((-2147483648) ^ blo$1)) : (((-2147483648) ^ ahi$1) >= ((-2147483648) ^ bhi$1)))) {
      var lo$1 = remLo;
      var hi$1 = remHi;
      var lo$2 = bShiftLo;
      var hi$2 = bShiftHi;
      var lo$3 = ((lo$1 - lo$2) | 0);
      var hi$3 = ((((-2147483648) ^ lo$3) > ((-2147483648) ^ lo$1)) ? (((-1) + ((hi$1 - hi$2) | 0)) | 0) : ((hi$1 - hi$2) | 0));
      remLo = lo$3;
      remHi = hi$3;
      if ((shift < 32)) {
        quotLo = (quotLo | (1 << shift))
      } else {
        quotHi = (quotHi | (1 << shift))
      }
    };
    shift = (((-1) + shift) | 0);
    var lo$4 = bShiftLo;
    var hi$4 = bShiftHi;
    var lo$5 = (((lo$4 >>> 1) | 0) | (hi$4 << 31));
    var hi$5 = ((hi$4 >>> 1) | 0);
    bShiftLo = lo$5;
    bShiftHi = hi$5
  };
  var alo$2 = remLo;
  var ahi$2 = remHi;
  if (((ahi$2 === bhi) ? (((-2147483648) ^ alo$2) >= ((-2147483648) ^ blo)) : (((-2147483648) ^ ahi$2) >= ((-2147483648) ^ bhi)))) {
    var lo$6 = remLo;
    var hi$6 = remHi;
    var remDouble = ((4.294967296E9 * hi$6) + $uD((lo$6 >>> 0)));
    var bDouble = ((4.294967296E9 * bhi) + $uD((blo >>> 0)));
    if ((ask !== 1)) {
      var x = (remDouble / bDouble);
      var lo$7 = $uI((x | 0));
      var x$1 = (x / 4.294967296E9);
      var hi$7 = $uI((x$1 | 0));
      var lo$8 = quotLo;
      var hi$8 = quotHi;
      var lo$9 = ((lo$8 + lo$7) | 0);
      var hi$9 = ((((-2147483648) ^ lo$9) < ((-2147483648) ^ lo$8)) ? ((1 + ((hi$8 + hi$7) | 0)) | 0) : ((hi$8 + hi$7) | 0));
      quotLo = lo$9;
      quotHi = hi$9
    };
    if ((ask !== 0)) {
      var rem_mod_bDouble = (remDouble % bDouble);
      remLo = $uI((rem_mod_bDouble | 0));
      var x$2 = (rem_mod_bDouble / 4.294967296E9);
      remHi = $uI((x$2 | 0))
    }
  };
  if ((ask === 0)) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = quotHi;
    var a = quotLo;
    return a
  } else if ((ask === 1)) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = remHi;
    var a$1 = remLo;
    return a$1
  } else {
    var _1 = quotLo;
    var _2 = quotHi;
    var _3 = remLo;
    var _4 = remHi;
    var a$2 = [_1, _2, _3, _4];
    return a$2
  }
});
$c_sjsr_RuntimeLong$.prototype.remainderImpl__I__I__I__I__I = (function(alo, ahi, blo, bhi) {
  if (((blo | bhi) === 0)) {
    throw new $c_jl_ArithmeticException().init___T("/ by zero")
  };
  if ((ahi === (alo >> 31))) {
    if ((bhi === (blo >> 31))) {
      if ((blo !== (-1))) {
        var lo = ((alo % blo) | 0);
        this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (lo >> 31);
        return lo
      } else {
        this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
        return 0
      }
    } else if (((alo === (-2147483648)) && ((blo === (-2147483648)) && (bhi === 0)))) {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
      return 0
    } else {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = ahi;
      return alo
    }
  } else {
    var neg = (ahi < 0);
    if (neg) {
      var lo$1 = ((-alo) | 0);
      var hi = ((alo !== 0) ? (~ahi) : ((-ahi) | 0));
      var abs_$_lo$2 = lo$1;
      var abs_$_hi$2 = hi
    } else {
      var abs_$_lo$2 = alo;
      var abs_$_hi$2 = ahi
    };
    var neg$1 = (bhi < 0);
    if (neg$1) {
      var lo$2 = ((-blo) | 0);
      var hi$1 = ((blo !== 0) ? (~bhi) : ((-bhi) | 0));
      var abs$1_$_lo$2 = lo$2;
      var abs$1_$_hi$2 = hi$1
    } else {
      var abs$1_$_lo$2 = blo;
      var abs$1_$_hi$2 = bhi
    };
    var absRLo = this.unsigned$und$percent__p1__I__I__I__I__I(abs_$_lo$2, abs_$_hi$2, abs$1_$_lo$2, abs$1_$_hi$2);
    if (neg) {
      var hi$2 = this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f;
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = ((absRLo !== 0) ? (~hi$2) : ((-hi$2) | 0));
      return ((-absRLo) | 0)
    } else {
      return absRLo
    }
  }
});
$c_sjsr_RuntimeLong$.prototype.unsigned$und$percent__p1__I__I__I__I__I = (function(alo, ahi, blo, bhi) {
  if ((((-2097152) & ahi) === 0)) {
    if ((((-2097152) & bhi) === 0)) {
      var aDouble = ((4.294967296E9 * ahi) + $uD((alo >>> 0)));
      var bDouble = ((4.294967296E9 * bhi) + $uD((blo >>> 0)));
      var rDouble = (aDouble % bDouble);
      var x = (rDouble / 4.294967296E9);
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = $uI((x | 0));
      return $uI((rDouble | 0))
    } else {
      this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = ahi;
      return alo
    }
  } else if (((bhi === 0) && ((blo & (((-1) + blo) | 0)) === 0))) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = 0;
    return (alo & (((-1) + blo) | 0))
  } else if (((blo === 0) && ((bhi & (((-1) + bhi) | 0)) === 0))) {
    this.scala$scalajs$runtime$RuntimeLong$$hiReturn$f = (ahi & (((-1) + bhi) | 0));
    return alo
  } else {
    return $uI(this.unsignedDivModHelper__p1__I__I__I__I__I__sjs_js_$bar(alo, ahi, blo, bhi, 1))
  }
});
$c_sjsr_RuntimeLong$.prototype.scala$scalajs$runtime$RuntimeLong$$timesHi__I__I__I__I__I = (function(alo, ahi, blo, bhi) {
  var a0 = (65535 & alo);
  var a1 = ((alo >>> 16) | 0);
  var a2 = (65535 & ahi);
  var a3 = ((ahi >>> 16) | 0);
  var b0 = (65535 & blo);
  var b1 = ((blo >>> 16) | 0);
  var b2 = (65535 & bhi);
  var b3 = ((bhi >>> 16) | 0);
  var c1part = (((($imul(a0, b0) >>> 16) | 0) + $imul(a1, b0)) | 0);
  var c2 = ((((c1part >>> 16) | 0) + (((((65535 & c1part) + $imul(a0, b1)) | 0) >>> 16) | 0)) | 0);
  var c3 = ((c2 >>> 16) | 0);
  c2 = (((65535 & c2) + $imul(a2, b0)) | 0);
  c3 = ((c3 + ((c2 >>> 16) | 0)) | 0);
  c2 = (((65535 & c2) + $imul(a1, b1)) | 0);
  c3 = ((c3 + ((c2 >>> 16) | 0)) | 0);
  c2 = (((65535 & c2) + $imul(a0, b2)) | 0);
  c3 = ((c3 + ((c2 >>> 16) | 0)) | 0);
  c3 = ((((((((c3 + $imul(a3, b0)) | 0) + $imul(a2, b1)) | 0) + $imul(a1, b2)) | 0) + $imul(a0, b3)) | 0);
  return ((65535 & c2) | (c3 << 16))
});
var $d_sjsr_RuntimeLong$ = new $TypeData().initClass({
  sjsr_RuntimeLong$: 0
}, false, "scala.scalajs.runtime.RuntimeLong$", {
  sjsr_RuntimeLong$: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sjsr_RuntimeLong$.prototype.$classData = $d_sjsr_RuntimeLong$;
var $n_sjsr_RuntimeLong$ = (void 0);
function $m_sjsr_RuntimeLong$() {
  if ((!$n_sjsr_RuntimeLong$)) {
    $n_sjsr_RuntimeLong$ = new $c_sjsr_RuntimeLong$().init___()
  };
  return $n_sjsr_RuntimeLong$
}
var $d_sr_Nothing$ = new $TypeData().initClass({
  sr_Nothing$: 0
}, false, "scala.runtime.Nothing$", {
  sr_Nothing$: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_Component$() {
  $c_s_Enumeration.call(this);
  this.Bounds$2 = null;
  this.Bullet$2 = null;
  this.Destroy$2 = null;
  this.Enemy$2 = null;
  this.Expires$2 = null;
  this.Firing$2 = null;
  this.Health$2 = null;
  this.Layer$2 = null;
  this.Player$2 = null;
  this.Position$2 = null;
  this.Resource$2 = null;
  this.Scale$2 = null;
  this.Score$2 = null;
  this.SoundEffect$2 = null;
  this.Tint$2 = null;
  this.Tween$2 = null;
  this.Velocity$2 = null;
  this.View$2 = null;
  this.TotalComponents$2 = null
}
$c_Lcom_darkoverlordofdata_demo_Component$.prototype = new $h_s_Enumeration();
$c_Lcom_darkoverlordofdata_demo_Component$.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_Component$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_Component$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_Component$.prototype = $c_Lcom_darkoverlordofdata_demo_Component$.prototype;
$c_Lcom_darkoverlordofdata_demo_Component$.prototype.init___ = (function() {
  $c_s_Enumeration.prototype.init___I.call(this, 0);
  $n_Lcom_darkoverlordofdata_demo_Component$ = this;
  var name = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Bounds");
  var i = this.nextId$1;
  this.Bounds$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i, name);
  var name$1 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Bullet");
  var i$1 = this.nextId$1;
  this.Bullet$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$1, name$1);
  var name$2 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Destroy");
  var i$2 = this.nextId$1;
  this.Destroy$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$2, name$2);
  var name$3 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Enemy");
  var i$3 = this.nextId$1;
  this.Enemy$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$3, name$3);
  var name$4 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Expires");
  var i$4 = this.nextId$1;
  this.Expires$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$4, name$4);
  var name$5 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Firing");
  var i$5 = this.nextId$1;
  this.Firing$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$5, name$5);
  var name$6 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Health");
  var i$6 = this.nextId$1;
  this.Health$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$6, name$6);
  var name$7 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Layer");
  var i$7 = this.nextId$1;
  this.Layer$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$7, name$7);
  var name$8 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Player");
  var i$8 = this.nextId$1;
  this.Player$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$8, name$8);
  var name$9 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Position");
  var i$9 = this.nextId$1;
  this.Position$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$9, name$9);
  var name$10 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Resource");
  var i$10 = this.nextId$1;
  this.Resource$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$10, name$10);
  var name$11 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Scale");
  var i$11 = this.nextId$1;
  this.Scale$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$11, name$11);
  var name$12 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Score");
  var i$12 = this.nextId$1;
  this.Score$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$12, name$12);
  var name$13 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "SoundEffect");
  var i$13 = this.nextId$1;
  this.SoundEffect$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$13, name$13);
  var name$14 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Tint");
  var i$14 = this.nextId$1;
  this.Tint$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$14, name$14);
  var name$15 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Tween");
  var i$15 = this.nextId$1;
  this.Tween$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$15, name$15);
  var name$16 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "Velocity");
  var i$16 = this.nextId$1;
  this.Velocity$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$16, name$16);
  var name$17 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "View");
  var i$17 = this.nextId$1;
  this.View$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$17, name$17);
  var name$18 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "TotalComponents");
  var i$18 = this.nextId$1;
  this.TotalComponents$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$18, name$18);
  return this
});
var $d_Lcom_darkoverlordofdata_demo_Component$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_Component$: 0
}, false, "com.darkoverlordofdata.demo.Component$", {
  Lcom_darkoverlordofdata_demo_Component$: 1,
  s_Enumeration: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_Component$.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_Component$;
var $n_Lcom_darkoverlordofdata_demo_Component$ = (void 0);
function $m_Lcom_darkoverlordofdata_demo_Component$() {
  if ((!$n_Lcom_darkoverlordofdata_demo_Component$)) {
    $n_Lcom_darkoverlordofdata_demo_Component$ = new $c_Lcom_darkoverlordofdata_demo_Component$().init___()
  };
  return $n_Lcom_darkoverlordofdata_demo_Component$
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_Effect$() {
  $c_s_Enumeration.call(this);
  this.PEW$2 = null;
  this.ASPLODE$2 = null;
  this.SMALLASPLODE$2 = null
}
$c_Lcom_darkoverlordofdata_demo_Effect$.prototype = new $h_s_Enumeration();
$c_Lcom_darkoverlordofdata_demo_Effect$.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_Effect$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_Effect$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_Effect$.prototype = $c_Lcom_darkoverlordofdata_demo_Effect$.prototype;
$c_Lcom_darkoverlordofdata_demo_Effect$.prototype.init___ = (function() {
  $c_s_Enumeration.prototype.init___I.call(this, 0);
  $n_Lcom_darkoverlordofdata_demo_Effect$ = this;
  var name = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "PEW");
  var i = this.nextId$1;
  this.PEW$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i, name);
  var name$1 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "ASPLODE");
  var i$1 = this.nextId$1;
  this.ASPLODE$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$1, name$1);
  var name$2 = (((this.nextName$1 !== null) && this.nextName$1.hasNext__Z()) ? $as_T(this.nextName$1.next__O()) : "SMALLASPLODE");
  var i$2 = this.nextId$1;
  this.SMALLASPLODE$2 = new $c_s_Enumeration$Val().init___s_Enumeration__I__T(this, i$2, name$2);
  return this
});
var $d_Lcom_darkoverlordofdata_demo_Effect$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_Effect$: 0
}, false, "com.darkoverlordofdata.demo.Effect$", {
  Lcom_darkoverlordofdata_demo_Effect$: 1,
  s_Enumeration: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_Effect$.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_Effect$;
var $n_Lcom_darkoverlordofdata_demo_Effect$ = (void 0);
function $m_Lcom_darkoverlordofdata_demo_Effect$() {
  if ((!$n_Lcom_darkoverlordofdata_demo_Effect$)) {
    $n_Lcom_darkoverlordofdata_demo_Effect$ = new $c_Lcom_darkoverlordofdata_demo_Effect$().init___()
  };
  return $n_Lcom_darkoverlordofdata_demo_Effect$
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_MenuUI() {
  $c_Lcom_badlogic_gdx_scenes_scene2d_Stage.call(this);
  this.playButtonVo$3 = null;
  this.playButtonActor$3 = null;
  this.pixelFactor$3 = 0.0
}
$c_Lcom_darkoverlordofdata_demo_MenuUI.prototype = new $h_Lcom_badlogic_gdx_scenes_scene2d_Stage();
$c_Lcom_darkoverlordofdata_demo_MenuUI.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_MenuUI;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_MenuUI() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_MenuUI.prototype = $c_Lcom_darkoverlordofdata_demo_MenuUI.prototype;
$c_Lcom_darkoverlordofdata_demo_MenuUI.prototype.init___Lcom_darkoverlordofdata_demo_Demo__Lcom_uwsoft_editor_renderer_SceneLoader = (function(game, sceneLoader) {
  $c_Lcom_badlogic_gdx_scenes_scene2d_Stage.prototype.init___.call(this);
  sceneLoader.loadScene("MenuScene", new $g.gdx.utils.viewport.FitViewport(320.0, 480.0));
  this.playButtonVo$3 = sceneLoader.loadVoFromLibrary("playButton");
  this.playButtonActor$3 = new $g.uwsoft.editor.renderer.scene2d.CompositeActor(this.playButtonVo$3, sceneLoader.getRm());
  this.pixelFactor$3 = (($fround($uI($g.gdx.Gdx.graphics.getDensity())) > 1.0) ? 2.0 : 1.0);
  var x = new $c_T3().init___O__O__O("class MenuUI", this.getWidth__F(), this.playButtonActor$3);
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V((x + "\n"));
  $g.gdx.Gdx.input.setInputProcessor(this);
  return this
});
var $d_Lcom_darkoverlordofdata_demo_MenuUI = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_MenuUI: 0
}, false, "com.darkoverlordofdata.demo.MenuUI", {
  Lcom_darkoverlordofdata_demo_MenuUI: 1,
  Lcom_badlogic_gdx_scenes_scene2d_Stage: 1,
  Lcom_badlogic_gdx_InputAdapter: 1,
  O: 1,
  Lcom_badlogic_gdx_InputProcessor: 1
});
$c_Lcom_darkoverlordofdata_demo_MenuUI.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_MenuUI;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException() {
  $c_jl_Exception.call(this)
}
$c_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException.prototype = new $h_jl_Exception();
$c_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException.prototype = $c_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException.prototype;
$c_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException.prototype.init___T__I = (function(message, index) {
  var s = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", "\\nEntity already has a component at index (", ")"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([message, index]));
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException: 0
}, false, "com.darkoverlordofdata.entitas.EntityAlreadyHasComponentException", {
  Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_EntityAlreadyHasComponentException;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException() {
  $c_jl_Exception.call(this)
}
$c_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException.prototype = new $h_jl_Exception();
$c_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException.prototype = $c_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException.prototype;
$c_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException.prototype.init___T__I = (function(message, index) {
  var s = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", "\\nEntity does not have a component at index (", ")"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([message, index]));
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException: 0
}, false, "com.darkoverlordofdata.entitas.EntityDoesNotHaveComponentException", {
  Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_EntityDoesNotHaveComponentException;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException() {
  $c_jl_Exception.call(this)
}
$c_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException.prototype = new $h_jl_Exception();
$c_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException.prototype = $c_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException.prototype;
$c_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException.prototype.init___T = (function(message) {
  var s = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", "\\nEntity is not destroyed yet!"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([message]));
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException: 0
}, false, "com.darkoverlordofdata.entitas.EntityIsNotDestroyedException", {
  Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_EntityIsNotDestroyedException;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException() {
  $c_jl_Exception.call(this)
}
$c_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException.prototype = new $h_jl_Exception();
$c_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException.prototype = $c_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException.prototype;
$c_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException.prototype.init___T = (function(message) {
  var s = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", "\\nEntity is not enabled"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([message]));
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException: 0
}, false, "com.darkoverlordofdata.entitas.EntityIsNotEnabledException", {
  Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_EntityIsNotEnabledException;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_GroupObserverException() {
  $c_jl_Exception.call(this)
}
$c_Lcom_darkoverlordofdata_entitas_GroupObserverException.prototype = new $h_jl_Exception();
$c_Lcom_darkoverlordofdata_entitas_GroupObserverException.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_GroupObserverException;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_GroupObserverException() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_GroupObserverException.prototype = $c_Lcom_darkoverlordofdata_entitas_GroupObserverException.prototype;
$c_Lcom_darkoverlordofdata_entitas_GroupObserverException.prototype.init___T = (function(message) {
  var s = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([message]));
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_GroupObserverException = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_GroupObserverException: 0
}, false, "com.darkoverlordofdata.entitas.GroupObserverException", {
  Lcom_darkoverlordofdata_entitas_GroupObserverException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_GroupObserverException.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_GroupObserverException;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_MatcherException() {
  $c_jl_Exception.call(this)
}
$c_Lcom_darkoverlordofdata_entitas_MatcherException.prototype = new $h_jl_Exception();
$c_Lcom_darkoverlordofdata_entitas_MatcherException.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_MatcherException;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_MatcherException() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_MatcherException.prototype = $c_Lcom_darkoverlordofdata_entitas_MatcherException.prototype;
$c_Lcom_darkoverlordofdata_entitas_MatcherException.prototype.init___Lcom_darkoverlordofdata_entitas_IMatcher = (function(matcher) {
  var jsx$1 = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["matcher.indices.length must be 1 but was ", ""]));
  var xs = matcher.indices__AI();
  var s = jsx$1.s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([xs.u.length]));
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_MatcherException = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_MatcherException: 0
}, false, "com.darkoverlordofdata.entitas.MatcherException", {
  Lcom_darkoverlordofdata_entitas_MatcherException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_MatcherException.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_MatcherException;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException() {
  $c_jl_Exception.call(this)
}
$c_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException.prototype = new $h_jl_Exception();
$c_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException.prototype = $c_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException.prototype;
$c_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException.prototype.init___Lcom_darkoverlordofdata_entitas_Entity__T = (function(entity, message) {
  var s = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["", "\\nPool does not contain entity ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([message, entity.toString__T()]));
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException: 0
}, false, "com.darkoverlordofdata.entitas.PoolDoesNotContainEntityException", {
  Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_PoolDoesNotContainEntityException;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_SingleEntityException() {
  $c_jl_Exception.call(this)
}
$c_Lcom_darkoverlordofdata_entitas_SingleEntityException.prototype = new $h_jl_Exception();
$c_Lcom_darkoverlordofdata_entitas_SingleEntityException.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_SingleEntityException;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_SingleEntityException() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_SingleEntityException.prototype = $c_Lcom_darkoverlordofdata_entitas_SingleEntityException.prototype;
$c_Lcom_darkoverlordofdata_entitas_SingleEntityException.prototype.init___Lcom_darkoverlordofdata_entitas_IMatcher = (function(matcher) {
  var s = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["Multiple entities exist matching ", ""])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([matcher.toString__T()]));
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_SingleEntityException = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_SingleEntityException: 0
}, false, "com.darkoverlordofdata.entitas.SingleEntityException", {
  Lcom_darkoverlordofdata_entitas_SingleEntityException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_SingleEntityException.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_SingleEntityException;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_Systems() {
  $c_O.call(this);
  this.$$undinitializeSystems$1 = null;
  this.$$undexecuteSystems$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_Systems.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_Systems.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_Systems;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_Systems() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_Systems.prototype = $c_Lcom_darkoverlordofdata_entitas_Systems.prototype;
$c_Lcom_darkoverlordofdata_entitas_Systems.prototype.init___ = (function() {
  this.$$undinitializeSystems$1 = new $c_scm_ArrayBuffer().init___();
  this.$$undexecuteSystems$1 = new $c_scm_ArrayBuffer().init___();
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Systems.prototype.initialize__V = (function() {
  var this$1 = this.$$undinitializeSystems$1;
  var i = 0;
  var top = this$1.size0$6;
  while ((i < top)) {
    var arg1 = this$1.array$6.u[i];
    var system = $as_Lcom_darkoverlordofdata_entitas_IInitializeSystem(arg1);
    system.initialize__V();
    i = ((1 + i) | 0)
  }
});
$c_Lcom_darkoverlordofdata_entitas_Systems.prototype.execute__V = (function() {
  var this$1 = this.$$undexecuteSystems$1;
  var i = 0;
  var top = this$1.size0$6;
  while ((i < top)) {
    var arg1 = this$1.array$6.u[i];
    var system = $as_Lcom_darkoverlordofdata_entitas_IExecuteSystem(arg1);
    system.execute__V();
    i = ((1 + i) | 0)
  }
});
$c_Lcom_darkoverlordofdata_entitas_Systems.prototype.add__Lcom_darkoverlordofdata_entitas_ISystem__Lcom_darkoverlordofdata_entitas_Systems = (function(system) {
  if ($is_Lcom_darkoverlordofdata_entitas_ReactiveSystem(system)) {
    var x2 = $as_Lcom_darkoverlordofdata_entitas_ReactiveSystem(system);
    var reactiveSystem = x2
  } else {
    var reactiveSystem = null
  };
  if ((reactiveSystem !== null)) {
    var x1$2 = reactiveSystem.subsystem$1;
    var initializeSystem = ($is_Lcom_darkoverlordofdata_entitas_IInitializeSystem(x1$2) ? x1$2 : null)
  } else if ($is_Lcom_darkoverlordofdata_entitas_IInitializeSystem(system)) {
    var x2$3 = $as_Lcom_darkoverlordofdata_entitas_IInitializeSystem(system);
    var initializeSystem = x2$3
  } else {
    var initializeSystem = null
  };
  if ((initializeSystem !== null)) {
    this.$$undinitializeSystems$1.$$plus$eq__O__scm_ArrayBuffer(initializeSystem)
  };
  if ($is_Lcom_darkoverlordofdata_entitas_IExecuteSystem(system)) {
    var x2$4 = $as_Lcom_darkoverlordofdata_entitas_IExecuteSystem(system);
    var executeSystem = x2$4
  } else {
    var executeSystem = null
  };
  if ((executeSystem !== null)) {
    this.$$undexecuteSystems$1.$$plus$eq__O__scm_ArrayBuffer(executeSystem)
  };
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_Systems = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_Systems: 0
}, false, "com.darkoverlordofdata.entitas.Systems", {
  Lcom_darkoverlordofdata_entitas_Systems: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IInitializeSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1
});
$c_Lcom_darkoverlordofdata_entitas_Systems.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_Systems;
/** @constructor */
function $c_Ljava_io_FilterOutputStream() {
  $c_Ljava_io_OutputStream.call(this);
  this.out$2 = null
}
$c_Ljava_io_FilterOutputStream.prototype = new $h_Ljava_io_OutputStream();
$c_Ljava_io_FilterOutputStream.prototype.constructor = $c_Ljava_io_FilterOutputStream;
/** @constructor */
function $h_Ljava_io_FilterOutputStream() {
  /*<skip>*/
}
$h_Ljava_io_FilterOutputStream.prototype = $c_Ljava_io_FilterOutputStream.prototype;
$c_Ljava_io_FilterOutputStream.prototype.init___Ljava_io_OutputStream = (function(out) {
  this.out$2 = out;
  return this
});
function $is_T(obj) {
  return ((typeof obj) === "string")
}
function $as_T(obj) {
  return (($is_T(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.String"))
}
function $isArrayOf_T(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.T)))
}
function $asArrayOf_T(obj, depth) {
  return (($isArrayOf_T(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.String;", depth))
}
var $d_T = new $TypeData().initClass({
  T: 0
}, false, "java.lang.String", {
  T: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_CharSequence: 1,
  jl_Comparable: 1
}, (void 0), (void 0), $is_T);
/** @constructor */
function $c_jl_AssertionError() {
  $c_jl_Error.call(this)
}
$c_jl_AssertionError.prototype = new $h_jl_Error();
$c_jl_AssertionError.prototype.constructor = $c_jl_AssertionError;
/** @constructor */
function $h_jl_AssertionError() {
  /*<skip>*/
}
$h_jl_AssertionError.prototype = $c_jl_AssertionError.prototype;
$c_jl_AssertionError.prototype.init___O = (function(o) {
  var s = $objectToString(o);
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_AssertionError = new $TypeData().initClass({
  jl_AssertionError: 0
}, false, "java.lang.AssertionError", {
  jl_AssertionError: 1,
  jl_Error: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_AssertionError.prototype.$classData = $d_jl_AssertionError;
var $d_jl_Byte = new $TypeData().initClass({
  jl_Byte: 0
}, false, "java.lang.Byte", {
  jl_Byte: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isByte(x)
}));
/** @constructor */
function $c_jl_CloneNotSupportedException() {
  $c_jl_Exception.call(this)
}
$c_jl_CloneNotSupportedException.prototype = new $h_jl_Exception();
$c_jl_CloneNotSupportedException.prototype.constructor = $c_jl_CloneNotSupportedException;
/** @constructor */
function $h_jl_CloneNotSupportedException() {
  /*<skip>*/
}
$h_jl_CloneNotSupportedException.prototype = $c_jl_CloneNotSupportedException.prototype;
$c_jl_CloneNotSupportedException.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
var $d_jl_CloneNotSupportedException = new $TypeData().initClass({
  jl_CloneNotSupportedException: 0
}, false, "java.lang.CloneNotSupportedException", {
  jl_CloneNotSupportedException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_CloneNotSupportedException.prototype.$classData = $d_jl_CloneNotSupportedException;
function $isArrayOf_jl_Double(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Double)))
}
function $asArrayOf_jl_Double(obj, depth) {
  return (($isArrayOf_jl_Double(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Double;", depth))
}
var $d_jl_Double = new $TypeData().initClass({
  jl_Double: 0
}, false, "java.lang.Double", {
  jl_Double: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return ((typeof x) === "number")
}));
var $d_jl_Float = new $TypeData().initClass({
  jl_Float: 0
}, false, "java.lang.Float", {
  jl_Float: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isFloat(x)
}));
var $d_jl_Integer = new $TypeData().initClass({
  jl_Integer: 0
}, false, "java.lang.Integer", {
  jl_Integer: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isInt(x)
}));
/** @constructor */
function $c_jl_JSConsoleBasedPrintStream$DummyOutputStream() {
  $c_Ljava_io_OutputStream.call(this)
}
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype = new $h_Ljava_io_OutputStream();
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype.constructor = $c_jl_JSConsoleBasedPrintStream$DummyOutputStream;
/** @constructor */
function $h_jl_JSConsoleBasedPrintStream$DummyOutputStream() {
  /*<skip>*/
}
$h_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype = $c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype;
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype.init___ = (function() {
  return this
});
var $d_jl_JSConsoleBasedPrintStream$DummyOutputStream = new $TypeData().initClass({
  jl_JSConsoleBasedPrintStream$DummyOutputStream: 0
}, false, "java.lang.JSConsoleBasedPrintStream$DummyOutputStream", {
  jl_JSConsoleBasedPrintStream$DummyOutputStream: 1,
  Ljava_io_OutputStream: 1,
  O: 1,
  Ljava_io_Closeable: 1,
  Ljava_io_Flushable: 1
});
$c_jl_JSConsoleBasedPrintStream$DummyOutputStream.prototype.$classData = $d_jl_JSConsoleBasedPrintStream$DummyOutputStream;
function $isArrayOf_jl_Long(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_Long)))
}
function $asArrayOf_jl_Long(obj, depth) {
  return (($isArrayOf_jl_Long(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.Long;", depth))
}
var $d_jl_Long = new $TypeData().initClass({
  jl_Long: 0
}, false, "java.lang.Long", {
  jl_Long: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $is_sjsr_RuntimeLong(x)
}));
/** @constructor */
function $c_jl_RuntimeException() {
  $c_jl_Exception.call(this)
}
$c_jl_RuntimeException.prototype = new $h_jl_Exception();
$c_jl_RuntimeException.prototype.constructor = $c_jl_RuntimeException;
/** @constructor */
function $h_jl_RuntimeException() {
  /*<skip>*/
}
$h_jl_RuntimeException.prototype = $c_jl_RuntimeException.prototype;
var $d_jl_Short = new $TypeData().initClass({
  jl_Short: 0
}, false, "java.lang.Short", {
  jl_Short: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
}, (void 0), (void 0), (function(x) {
  return $isShort(x)
}));
/** @constructor */
function $c_jl_StringBuilder() {
  $c_O.call(this);
  this.content$1 = null
}
$c_jl_StringBuilder.prototype = new $h_O();
$c_jl_StringBuilder.prototype.constructor = $c_jl_StringBuilder;
/** @constructor */
function $h_jl_StringBuilder() {
  /*<skip>*/
}
$h_jl_StringBuilder.prototype = $c_jl_StringBuilder.prototype;
$c_jl_StringBuilder.prototype.init___ = (function() {
  $c_jl_StringBuilder.prototype.init___T.call(this, "");
  return this
});
$c_jl_StringBuilder.prototype.append__T__jl_StringBuilder = (function(s) {
  this.content$1 = (("" + this.content$1) + ((s === null) ? "null" : s));
  return this
});
$c_jl_StringBuilder.prototype.subSequence__I__I__jl_CharSequence = (function(start, end) {
  var thiz = this.content$1;
  return $as_T(thiz.substring(start, end))
});
$c_jl_StringBuilder.prototype.toString__T = (function() {
  return this.content$1
});
$c_jl_StringBuilder.prototype.append__O__jl_StringBuilder = (function(obj) {
  return ((obj === null) ? this.append__T__jl_StringBuilder(null) : this.append__T__jl_StringBuilder($objectToString(obj)))
});
$c_jl_StringBuilder.prototype.init___I = (function(initialCapacity) {
  $c_jl_StringBuilder.prototype.init___T.call(this, "");
  return this
});
$c_jl_StringBuilder.prototype.append__jl_CharSequence__I__I__jl_StringBuilder = (function(csq, start, end) {
  return ((csq === null) ? this.append__jl_CharSequence__I__I__jl_StringBuilder("null", start, end) : this.append__T__jl_StringBuilder($objectToString($charSequenceSubSequence(csq, start, end))))
});
$c_jl_StringBuilder.prototype.append__C__jl_StringBuilder = (function(c) {
  return this.append__T__jl_StringBuilder($as_T($g.String.fromCharCode(c)))
});
$c_jl_StringBuilder.prototype.init___T = (function(content) {
  this.content$1 = content;
  return this
});
var $d_jl_StringBuilder = new $TypeData().initClass({
  jl_StringBuilder: 0
}, false, "java.lang.StringBuilder", {
  jl_StringBuilder: 1,
  O: 1,
  jl_CharSequence: 1,
  jl_Appendable: 1,
  Ljava_io_Serializable: 1
});
$c_jl_StringBuilder.prototype.$classData = $d_jl_StringBuilder;
/** @constructor */
function $c_s_Array$() {
  $c_s_FallbackArrayBuilding.call(this)
}
$c_s_Array$.prototype = new $h_s_FallbackArrayBuilding();
$c_s_Array$.prototype.constructor = $c_s_Array$;
/** @constructor */
function $h_s_Array$() {
  /*<skip>*/
}
$h_s_Array$.prototype = $c_s_Array$.prototype;
$c_s_Array$.prototype.init___ = (function() {
  return this
});
$c_s_Array$.prototype.slowcopy__p2__O__I__O__I__I__V = (function(src, srcPos, dest, destPos, length) {
  var i = srcPos;
  var j = destPos;
  var srcUntil = ((srcPos + length) | 0);
  while ((i < srcUntil)) {
    $m_sr_ScalaRunTime$().array$undupdate__O__I__O__V(dest, j, $m_sr_ScalaRunTime$().array$undapply__O__I__O(src, i));
    i = ((1 + i) | 0);
    j = ((1 + j) | 0)
  }
});
$c_s_Array$.prototype.apply__I__sc_Seq__AI = (function(x, xs) {
  var array = $newArrayObject($d_I.getArrayOf(), [((1 + xs.length__I()) | 0)]);
  array.u[0] = x;
  var elem$1 = 0;
  elem$1 = 1;
  var this$2 = xs.iterator__sc_Iterator();
  while (this$2.hasNext__Z()) {
    var arg1 = this$2.next__O();
    var x$1 = $uI(arg1);
    array.u[elem$1] = x$1;
    elem$1 = ((1 + elem$1) | 0)
  };
  return array
});
$c_s_Array$.prototype.copy__O__I__O__I__I__V = (function(src, srcPos, dest, destPos, length) {
  var srcClass = $objectGetClass(src);
  if ((srcClass.isArray__Z() && $objectGetClass(dest).isAssignableFrom__jl_Class__Z(srcClass))) {
    $systemArraycopy(src, srcPos, dest, destPos, length)
  } else {
    this.slowcopy__p2__O__I__O__I__I__V(src, srcPos, dest, destPos, length)
  }
});
var $d_s_Array$ = new $TypeData().initClass({
  s_Array$: 0
}, false, "scala.Array$", {
  s_Array$: 1,
  s_FallbackArrayBuilding: 1,
  O: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Array$.prototype.$classData = $d_s_Array$;
var $n_s_Array$ = (void 0);
function $m_s_Array$() {
  if ((!$n_s_Array$)) {
    $n_s_Array$ = new $c_s_Array$().init___()
  };
  return $n_s_Array$
}
/** @constructor */
function $c_s_Predef$$eq$colon$eq() {
  $c_O.call(this)
}
$c_s_Predef$$eq$colon$eq.prototype = new $h_O();
$c_s_Predef$$eq$colon$eq.prototype.constructor = $c_s_Predef$$eq$colon$eq;
/** @constructor */
function $h_s_Predef$$eq$colon$eq() {
  /*<skip>*/
}
$h_s_Predef$$eq$colon$eq.prototype = $c_s_Predef$$eq$colon$eq.prototype;
$c_s_Predef$$eq$colon$eq.prototype.toString__T = (function() {
  return "<function1>"
});
/** @constructor */
function $c_s_Predef$$less$colon$less() {
  $c_O.call(this)
}
$c_s_Predef$$less$colon$less.prototype = new $h_O();
$c_s_Predef$$less$colon$less.prototype.constructor = $c_s_Predef$$less$colon$less;
/** @constructor */
function $h_s_Predef$$less$colon$less() {
  /*<skip>*/
}
$h_s_Predef$$less$colon$less.prototype = $c_s_Predef$$less$colon$less.prototype;
$c_s_Predef$$less$colon$less.prototype.toString__T = (function() {
  return "<function1>"
});
/** @constructor */
function $c_s_math_Equiv$() {
  $c_O.call(this)
}
$c_s_math_Equiv$.prototype = new $h_O();
$c_s_math_Equiv$.prototype.constructor = $c_s_math_Equiv$;
/** @constructor */
function $h_s_math_Equiv$() {
  /*<skip>*/
}
$h_s_math_Equiv$.prototype = $c_s_math_Equiv$.prototype;
$c_s_math_Equiv$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Equiv$ = new $TypeData().initClass({
  s_math_Equiv$: 0
}, false, "scala.math.Equiv$", {
  s_math_Equiv$: 1,
  O: 1,
  s_math_LowPriorityEquiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Equiv$.prototype.$classData = $d_s_math_Equiv$;
var $n_s_math_Equiv$ = (void 0);
function $m_s_math_Equiv$() {
  if ((!$n_s_math_Equiv$)) {
    $n_s_math_Equiv$ = new $c_s_math_Equiv$().init___()
  };
  return $n_s_math_Equiv$
}
/** @constructor */
function $c_s_math_Ordering$() {
  $c_O.call(this)
}
$c_s_math_Ordering$.prototype = new $h_O();
$c_s_math_Ordering$.prototype.constructor = $c_s_math_Ordering$;
/** @constructor */
function $h_s_math_Ordering$() {
  /*<skip>*/
}
$h_s_math_Ordering$.prototype = $c_s_math_Ordering$.prototype;
$c_s_math_Ordering$.prototype.init___ = (function() {
  return this
});
var $d_s_math_Ordering$ = new $TypeData().initClass({
  s_math_Ordering$: 0
}, false, "scala.math.Ordering$", {
  s_math_Ordering$: 1,
  O: 1,
  s_math_LowPriorityOrderingImplicits: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$.prototype.$classData = $d_s_math_Ordering$;
var $n_s_math_Ordering$ = (void 0);
function $m_s_math_Ordering$() {
  if ((!$n_s_math_Ordering$)) {
    $n_s_math_Ordering$ = new $c_s_math_Ordering$().init___()
  };
  return $n_s_math_Ordering$
}
/** @constructor */
function $c_s_reflect_NoManifest$() {
  $c_O.call(this)
}
$c_s_reflect_NoManifest$.prototype = new $h_O();
$c_s_reflect_NoManifest$.prototype.constructor = $c_s_reflect_NoManifest$;
/** @constructor */
function $h_s_reflect_NoManifest$() {
  /*<skip>*/
}
$h_s_reflect_NoManifest$.prototype = $c_s_reflect_NoManifest$.prototype;
$c_s_reflect_NoManifest$.prototype.init___ = (function() {
  return this
});
$c_s_reflect_NoManifest$.prototype.toString__T = (function() {
  return "<?>"
});
var $d_s_reflect_NoManifest$ = new $TypeData().initClass({
  s_reflect_NoManifest$: 0
}, false, "scala.reflect.NoManifest$", {
  s_reflect_NoManifest$: 1,
  O: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_reflect_NoManifest$.prototype.$classData = $d_s_reflect_NoManifest$;
var $n_s_reflect_NoManifest$ = (void 0);
function $m_s_reflect_NoManifest$() {
  if ((!$n_s_reflect_NoManifest$)) {
    $n_s_reflect_NoManifest$ = new $c_s_reflect_NoManifest$().init___()
  };
  return $n_s_reflect_NoManifest$
}
/** @constructor */
function $c_sc_AbstractIterator() {
  $c_O.call(this)
}
$c_sc_AbstractIterator.prototype = new $h_O();
$c_sc_AbstractIterator.prototype.constructor = $c_sc_AbstractIterator;
/** @constructor */
function $h_sc_AbstractIterator() {
  /*<skip>*/
}
$h_sc_AbstractIterator.prototype = $c_sc_AbstractIterator.prototype;
$c_sc_AbstractIterator.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sc_AbstractIterator.prototype.isEmpty__Z = (function() {
  return $s_sc_Iterator$class__isEmpty__sc_Iterator__Z(this)
});
$c_sc_AbstractIterator.prototype.toString__T = (function() {
  return $s_sc_Iterator$class__toString__sc_Iterator__T(this)
});
$c_sc_AbstractIterator.prototype.foreach__F1__V = (function(f) {
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this, f)
});
$c_sc_AbstractIterator.prototype.toStream__sci_Stream = (function() {
  return $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream(this)
});
$c_sc_AbstractIterator.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_AbstractIterator.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_Iterator$class__copyToArray__sc_Iterator__O__I__I__V(this, xs, start, len)
});
/** @constructor */
function $c_scg_SetFactory() {
  $c_scg_GenSetFactory.call(this)
}
$c_scg_SetFactory.prototype = new $h_scg_GenSetFactory();
$c_scg_SetFactory.prototype.constructor = $c_scg_SetFactory;
/** @constructor */
function $h_scg_SetFactory() {
  /*<skip>*/
}
$h_scg_SetFactory.prototype = $c_scg_SetFactory.prototype;
/** @constructor */
function $c_sci_ListSet$ListSetBuilder() {
  $c_O.call(this);
  this.elems$1 = null;
  this.seen$1 = null
}
$c_sci_ListSet$ListSetBuilder.prototype = new $h_O();
$c_sci_ListSet$ListSetBuilder.prototype.constructor = $c_sci_ListSet$ListSetBuilder;
/** @constructor */
function $h_sci_ListSet$ListSetBuilder() {
  /*<skip>*/
}
$h_sci_ListSet$ListSetBuilder.prototype = $c_sci_ListSet$ListSetBuilder.prototype;
$c_sci_ListSet$ListSetBuilder.prototype.result__sci_ListSet = (function() {
  var this$2 = this.elems$1;
  var z = $m_sci_ListSet$EmptyListSet$();
  var this$3 = this$2.scala$collection$mutable$ListBuffer$$start$6;
  var acc = z;
  var these = this$3;
  while ((!these.isEmpty__Z())) {
    var arg1 = acc;
    var arg2 = these.head__O();
    var x$1 = $as_sci_ListSet(arg1);
    acc = new $c_sci_ListSet$Node().init___sci_ListSet__O(x$1, arg2);
    these = $as_sc_LinearSeqOptimized(these.tail__O())
  };
  return $as_sci_ListSet(acc)
});
$c_sci_ListSet$ListSetBuilder.prototype.init___ = (function() {
  $c_sci_ListSet$ListSetBuilder.prototype.init___sci_ListSet.call(this, $m_sci_ListSet$EmptyListSet$());
  return this
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__sci_ListSet$ListSetBuilder(elem)
});
$c_sci_ListSet$ListSetBuilder.prototype.init___sci_ListSet = (function(initial) {
  var this$1 = new $c_scm_ListBuffer().init___().$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer(initial);
  this.elems$1 = $as_scm_ListBuffer($s_sc_SeqLike$class__reverse__sc_SeqLike__O(this$1));
  var this$2 = new $c_scm_HashSet().init___();
  this.seen$1 = $as_scm_HashSet($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this$2, initial));
  return this
});
$c_sci_ListSet$ListSetBuilder.prototype.result__O = (function() {
  return this.result__sci_ListSet()
});
$c_sci_ListSet$ListSetBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__sci_ListSet$ListSetBuilder(elem)
});
$c_sci_ListSet$ListSetBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$eq__O__sci_ListSet$ListSetBuilder = (function(x) {
  var this$1 = this.seen$1;
  if ((!$s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this$1, x))) {
    this.elems$1.$$plus$eq__O__scm_ListBuffer(x);
    this.seen$1.$$plus$eq__O__scm_HashSet(x)
  };
  return this
});
$c_sci_ListSet$ListSetBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_sci_ListSet$ListSetBuilder = new $TypeData().initClass({
  sci_ListSet$ListSetBuilder: 0
}, false, "scala.collection.immutable.ListSet$ListSetBuilder", {
  sci_ListSet$ListSetBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_sci_ListSet$ListSetBuilder.prototype.$classData = $d_sci_ListSet$ListSetBuilder;
/** @constructor */
function $c_sci_Map$() {
  $c_scg_ImmutableMapFactory.call(this)
}
$c_sci_Map$.prototype = new $h_scg_ImmutableMapFactory();
$c_sci_Map$.prototype.constructor = $c_sci_Map$;
/** @constructor */
function $h_sci_Map$() {
  /*<skip>*/
}
$h_sci_Map$.prototype = $c_sci_Map$.prototype;
$c_sci_Map$.prototype.init___ = (function() {
  return this
});
var $d_sci_Map$ = new $TypeData().initClass({
  sci_Map$: 0
}, false, "scala.collection.immutable.Map$", {
  sci_Map$: 1,
  scg_ImmutableMapFactory: 1,
  scg_MapFactory: 1,
  scg_GenMapFactory: 1,
  O: 1
});
$c_sci_Map$.prototype.$classData = $d_sci_Map$;
var $n_sci_Map$ = (void 0);
function $m_sci_Map$() {
  if ((!$n_sci_Map$)) {
    $n_sci_Map$ = new $c_sci_Map$().init___()
  };
  return $n_sci_Map$
}
/** @constructor */
function $c_scm_DefaultEntry() {
  $c_O.call(this);
  this.key$1 = null;
  this.value$1 = null;
  this.next$1 = null
}
$c_scm_DefaultEntry.prototype = new $h_O();
$c_scm_DefaultEntry.prototype.constructor = $c_scm_DefaultEntry;
/** @constructor */
function $h_scm_DefaultEntry() {
  /*<skip>*/
}
$h_scm_DefaultEntry.prototype = $c_scm_DefaultEntry.prototype;
$c_scm_DefaultEntry.prototype.chainString__T = (function() {
  var jsx$3 = this.key$1;
  var jsx$2 = this.value$1;
  if ((this.next$1 !== null)) {
    var this$1 = $as_scm_DefaultEntry(this.next$1);
    var jsx$1 = (" -> " + this$1.chainString__T())
  } else {
    var jsx$1 = ""
  };
  return ((((("(kv: " + jsx$3) + ", ") + jsx$2) + ")") + jsx$1)
});
$c_scm_DefaultEntry.prototype.init___O__O = (function(key, value) {
  this.key$1 = key;
  this.value$1 = value;
  return this
});
$c_scm_DefaultEntry.prototype.toString__T = (function() {
  return this.chainString__T()
});
function $is_scm_DefaultEntry(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_DefaultEntry)))
}
function $as_scm_DefaultEntry(obj) {
  return (($is_scm_DefaultEntry(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.DefaultEntry"))
}
function $isArrayOf_scm_DefaultEntry(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_DefaultEntry)))
}
function $asArrayOf_scm_DefaultEntry(obj, depth) {
  return (($isArrayOf_scm_DefaultEntry(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.DefaultEntry;", depth))
}
var $d_scm_DefaultEntry = new $TypeData().initClass({
  scm_DefaultEntry: 0
}, false, "scala.collection.mutable.DefaultEntry", {
  scm_DefaultEntry: 1,
  O: 1,
  scm_HashEntry: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_DefaultEntry.prototype.$classData = $d_scm_DefaultEntry;
/** @constructor */
function $c_scm_GrowingBuilder() {
  $c_O.call(this);
  this.empty$1 = null;
  this.elems$1 = null
}
$c_scm_GrowingBuilder.prototype = new $h_O();
$c_scm_GrowingBuilder.prototype.constructor = $c_scm_GrowingBuilder;
/** @constructor */
function $h_scm_GrowingBuilder() {
  /*<skip>*/
}
$h_scm_GrowingBuilder.prototype = $c_scm_GrowingBuilder.prototype;
$c_scm_GrowingBuilder.prototype.init___scg_Growable = (function(empty) {
  this.empty$1 = empty;
  this.elems$1 = empty;
  return this
});
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scm_GrowingBuilder = (function(x) {
  this.elems$1.$$plus$eq__O__scg_Growable(x);
  return this
});
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_GrowingBuilder(elem)
});
$c_scm_GrowingBuilder.prototype.result__O = (function() {
  return this.elems$1
});
$c_scm_GrowingBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_GrowingBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_GrowingBuilder(elem)
});
$c_scm_GrowingBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_GrowingBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_GrowingBuilder = new $TypeData().initClass({
  scm_GrowingBuilder: 0
}, false, "scala.collection.mutable.GrowingBuilder", {
  scm_GrowingBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_scm_GrowingBuilder.prototype.$classData = $d_scm_GrowingBuilder;
/** @constructor */
function $c_scm_LazyBuilder() {
  $c_O.call(this);
  this.parts$1 = null
}
$c_scm_LazyBuilder.prototype = new $h_O();
$c_scm_LazyBuilder.prototype.constructor = $c_scm_LazyBuilder;
/** @constructor */
function $h_scm_LazyBuilder() {
  /*<skip>*/
}
$h_scm_LazyBuilder.prototype = $c_scm_LazyBuilder.prototype;
$c_scm_LazyBuilder.prototype.init___ = (function() {
  this.parts$1 = new $c_scm_ListBuffer().init___();
  return this
});
$c_scm_LazyBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_LazyBuilder = (function(xs) {
  this.parts$1.$$plus$eq__O__scm_ListBuffer(xs);
  return this
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_LazyBuilder(elem)
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scm_LazyBuilder = (function(x) {
  var jsx$1 = this.parts$1;
  $m_sci_List$();
  var xs = new $c_sjs_js_WrappedArray().init___sjs_js_Array([x]);
  var this$2 = $m_sci_List$();
  var cbf = this$2.ReusableCBFInstance$2;
  jsx$1.$$plus$eq__O__scm_ListBuffer($as_sci_List($s_sc_TraversableLike$class__to__sc_TraversableLike__scg_CanBuildFrom__O(xs, cbf)));
  return this
});
$c_scm_LazyBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_LazyBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_LazyBuilder(elem)
});
$c_scm_LazyBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_LazyBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_LazyBuilder(xs)
});
/** @constructor */
function $c_scm_SetBuilder() {
  $c_O.call(this);
  this.empty$1 = null;
  this.elems$1 = null
}
$c_scm_SetBuilder.prototype = new $h_O();
$c_scm_SetBuilder.prototype.constructor = $c_scm_SetBuilder;
/** @constructor */
function $h_scm_SetBuilder() {
  /*<skip>*/
}
$h_scm_SetBuilder.prototype = $c_scm_SetBuilder.prototype;
$c_scm_SetBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_SetBuilder(elem)
});
$c_scm_SetBuilder.prototype.result__O = (function() {
  return this.elems$1
});
$c_scm_SetBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_SetBuilder.prototype.$$plus$eq__O__scm_SetBuilder = (function(x) {
  this.elems$1 = this.elems$1.$$plus__O__sc_Set(x);
  return this
});
$c_scm_SetBuilder.prototype.init___sc_Set = (function(empty) {
  this.empty$1 = empty;
  this.elems$1 = empty;
  return this
});
$c_scm_SetBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_SetBuilder(elem)
});
$c_scm_SetBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_SetBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_SetBuilder = new $TypeData().initClass({
  scm_SetBuilder: 0
}, false, "scala.collection.mutable.SetBuilder", {
  scm_SetBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_scm_SetBuilder.prototype.$classData = $d_scm_SetBuilder;
/** @constructor */
function $c_scm_WrappedArrayBuilder() {
  $c_O.call(this);
  this.tag$1 = null;
  this.manifest$1 = null;
  this.elems$1 = null;
  this.capacity$1 = 0;
  this.size$1 = 0
}
$c_scm_WrappedArrayBuilder.prototype = new $h_O();
$c_scm_WrappedArrayBuilder.prototype.constructor = $c_scm_WrappedArrayBuilder;
/** @constructor */
function $h_scm_WrappedArrayBuilder() {
  /*<skip>*/
}
$h_scm_WrappedArrayBuilder.prototype = $c_scm_WrappedArrayBuilder.prototype;
$c_scm_WrappedArrayBuilder.prototype.init___s_reflect_ClassTag = (function(tag) {
  this.tag$1 = tag;
  this.manifest$1 = tag;
  this.capacity$1 = 0;
  this.size$1 = 0;
  return this
});
$c_scm_WrappedArrayBuilder.prototype.ensureSize__p1__I__V = (function(size) {
  if ((this.capacity$1 < size)) {
    var newsize = ((this.capacity$1 === 0) ? 16 : (this.capacity$1 << 1));
    while ((newsize < size)) {
      newsize = (newsize << 1)
    };
    this.resize__p1__I__V(newsize)
  }
});
$c_scm_WrappedArrayBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_WrappedArrayBuilder(elem)
});
$c_scm_WrappedArrayBuilder.prototype.$$plus$eq__O__scm_WrappedArrayBuilder = (function(elem) {
  this.ensureSize__p1__I__V(((1 + this.size$1) | 0));
  this.elems$1.update__I__O__V(this.size$1, elem);
  this.size$1 = ((1 + this.size$1) | 0);
  return this
});
$c_scm_WrappedArrayBuilder.prototype.mkArray__p1__I__scm_WrappedArray = (function(size) {
  var schematic = this.tag$1;
  if ($is_jl_Class(schematic)) {
    var x2 = $as_jl_Class(schematic);
    var runtimeClass = x2.getComponentType__jl_Class()
  } else {
    if ((schematic === null)) {
      throw new $c_jl_UnsupportedOperationException().init___T(new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["unsupported schematic ", " (", ")"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([schematic, $objectGetClass(schematic)])))
    };
    var runtimeClass = schematic.runtimeClass__jl_Class()
  };
  var newelems = ((runtimeClass === $d_B.getClassOf()) ? new $c_scm_WrappedArray$ofByte().init___AB($newArrayObject($d_B.getArrayOf(), [size])) : ((runtimeClass === $d_S.getClassOf()) ? new $c_scm_WrappedArray$ofShort().init___AS($newArrayObject($d_S.getArrayOf(), [size])) : ((runtimeClass === $d_C.getClassOf()) ? new $c_scm_WrappedArray$ofChar().init___AC($newArrayObject($d_C.getArrayOf(), [size])) : ((runtimeClass === $d_I.getClassOf()) ? new $c_scm_WrappedArray$ofInt().init___AI($newArrayObject($d_I.getArrayOf(), [size])) : ((runtimeClass === $d_J.getClassOf()) ? new $c_scm_WrappedArray$ofLong().init___AJ($newArrayObject($d_J.getArrayOf(), [size])) : ((runtimeClass === $d_F.getClassOf()) ? new $c_scm_WrappedArray$ofFloat().init___AF($newArrayObject($d_F.getArrayOf(), [size])) : ((runtimeClass === $d_D.getClassOf()) ? new $c_scm_WrappedArray$ofDouble().init___AD($newArrayObject($d_D.getArrayOf(), [size])) : ((runtimeClass === $d_Z.getClassOf()) ? new $c_scm_WrappedArray$ofBoolean().init___AZ($newArrayObject($d_Z.getArrayOf(), [size])) : ((runtimeClass === $d_V.getClassOf()) ? new $c_scm_WrappedArray$ofUnit().init___Asr_BoxedUnit($newArrayObject($d_sr_BoxedUnit.getArrayOf(), [size])) : new $c_scm_WrappedArray$ofRef().init___AO($asArrayOf_O(this.tag$1.newArray__I__O(size), 1)))))))))));
  if ((this.size$1 > 0)) {
    $m_s_Array$().copy__O__I__O__I__I__V(this.elems$1.array__O(), 0, newelems.array__O(), 0, this.size$1)
  };
  return newelems
});
$c_scm_WrappedArrayBuilder.prototype.result__O = (function() {
  return this.result__scm_WrappedArray()
});
$c_scm_WrappedArrayBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_WrappedArrayBuilder.prototype.resize__p1__I__V = (function(size) {
  this.elems$1 = this.mkArray__p1__I__scm_WrappedArray(size);
  this.capacity$1 = size
});
$c_scm_WrappedArrayBuilder.prototype.result__scm_WrappedArray = (function() {
  return (((this.capacity$1 !== 0) && (this.capacity$1 === this.size$1)) ? this.elems$1 : this.mkArray__p1__I__scm_WrappedArray(this.size$1))
});
$c_scm_WrappedArrayBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_WrappedArrayBuilder(elem)
});
$c_scm_WrappedArrayBuilder.prototype.sizeHint__I__V = (function(size) {
  if ((this.capacity$1 < size)) {
    this.resize__p1__I__V(size)
  }
});
$c_scm_WrappedArrayBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_WrappedArrayBuilder = new $TypeData().initClass({
  scm_WrappedArrayBuilder: 0
}, false, "scala.collection.mutable.WrappedArrayBuilder", {
  scm_WrappedArrayBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_scm_WrappedArrayBuilder.prototype.$classData = $d_scm_WrappedArrayBuilder;
/** @constructor */
function $c_sjsr_RuntimeLong() {
  $c_jl_Number.call(this);
  this.lo$2 = 0;
  this.hi$2 = 0
}
$c_sjsr_RuntimeLong.prototype = new $h_jl_Number();
$c_sjsr_RuntimeLong.prototype.constructor = $c_sjsr_RuntimeLong;
/** @constructor */
function $h_sjsr_RuntimeLong() {
  /*<skip>*/
}
$h_sjsr_RuntimeLong.prototype = $c_sjsr_RuntimeLong.prototype;
$c_sjsr_RuntimeLong.prototype.longValue__J = (function() {
  return $uJ(this)
});
$c_sjsr_RuntimeLong.prototype.$$bar__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  return new $c_sjsr_RuntimeLong().init___I__I((this.lo$2 | b.lo$2), (this.hi$2 | b.hi$2))
});
$c_sjsr_RuntimeLong.prototype.$$greater$eq__sjsr_RuntimeLong__Z = (function(b) {
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  return ((ahi === bhi) ? (((-2147483648) ^ this.lo$2) >= ((-2147483648) ^ b.lo$2)) : (ahi > bhi))
});
$c_sjsr_RuntimeLong.prototype.byteValue__B = (function() {
  return ((this.lo$2 << 24) >> 24)
});
$c_sjsr_RuntimeLong.prototype.equals__O__Z = (function(that) {
  if ($is_sjsr_RuntimeLong(that)) {
    var x2 = $as_sjsr_RuntimeLong(that);
    return ((this.lo$2 === x2.lo$2) && (this.hi$2 === x2.hi$2))
  } else {
    return false
  }
});
$c_sjsr_RuntimeLong.prototype.$$less__sjsr_RuntimeLong__Z = (function(b) {
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  return ((ahi === bhi) ? (((-2147483648) ^ this.lo$2) < ((-2147483648) ^ b.lo$2)) : (ahi < bhi))
});
$c_sjsr_RuntimeLong.prototype.$$times__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  var alo = this.lo$2;
  var blo = b.lo$2;
  return new $c_sjsr_RuntimeLong().init___I__I($imul(alo, blo), $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$timesHi__I__I__I__I__I(alo, this.hi$2, blo, b.hi$2))
});
$c_sjsr_RuntimeLong.prototype.init___I__I__I = (function(l, m, h) {
  $c_sjsr_RuntimeLong.prototype.init___I__I.call(this, (l | (m << 22)), ((m >> 10) | (h << 12)));
  return this
});
$c_sjsr_RuntimeLong.prototype.$$percent__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  var this$1 = $m_sjsr_RuntimeLong$();
  var lo = this$1.remainderImpl__I__I__I__I__I(this.lo$2, this.hi$2, b.lo$2, b.hi$2);
  return new $c_sjsr_RuntimeLong().init___I__I(lo, this$1.scala$scalajs$runtime$RuntimeLong$$hiReturn$f)
});
$c_sjsr_RuntimeLong.prototype.toString__T = (function() {
  return $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toString__I__I__T(this.lo$2, this.hi$2)
});
$c_sjsr_RuntimeLong.prototype.init___I__I = (function(lo, hi) {
  this.lo$2 = lo;
  this.hi$2 = hi;
  return this
});
$c_sjsr_RuntimeLong.prototype.compareTo__O__I = (function(x$1) {
  var that = $as_sjsr_RuntimeLong(x$1);
  return $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$compare__I__I__I__I__I(this.lo$2, this.hi$2, that.lo$2, that.hi$2)
});
$c_sjsr_RuntimeLong.prototype.$$less$eq__sjsr_RuntimeLong__Z = (function(b) {
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  return ((ahi === bhi) ? (((-2147483648) ^ this.lo$2) <= ((-2147483648) ^ b.lo$2)) : (ahi < bhi))
});
$c_sjsr_RuntimeLong.prototype.$$amp__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  return new $c_sjsr_RuntimeLong().init___I__I((this.lo$2 & b.lo$2), (this.hi$2 & b.hi$2))
});
$c_sjsr_RuntimeLong.prototype.$$greater$greater$greater__I__sjsr_RuntimeLong = (function(n) {
  return new $c_sjsr_RuntimeLong().init___I__I((((32 & n) === 0) ? (((this.lo$2 >>> n) | 0) | ((this.hi$2 << 1) << ((31 - n) | 0))) : ((this.hi$2 >>> n) | 0)), (((32 & n) === 0) ? ((this.hi$2 >>> n) | 0) : 0))
});
$c_sjsr_RuntimeLong.prototype.$$greater__sjsr_RuntimeLong__Z = (function(b) {
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  return ((ahi === bhi) ? (((-2147483648) ^ this.lo$2) > ((-2147483648) ^ b.lo$2)) : (ahi > bhi))
});
$c_sjsr_RuntimeLong.prototype.$$less$less__I__sjsr_RuntimeLong = (function(n) {
  return new $c_sjsr_RuntimeLong().init___I__I((((32 & n) === 0) ? (this.lo$2 << n) : 0), (((32 & n) === 0) ? (((((this.lo$2 >>> 1) | 0) >>> ((31 - n) | 0)) | 0) | (this.hi$2 << n)) : (this.lo$2 << n)))
});
$c_sjsr_RuntimeLong.prototype.init___I = (function(value) {
  $c_sjsr_RuntimeLong.prototype.init___I__I.call(this, value, (value >> 31));
  return this
});
$c_sjsr_RuntimeLong.prototype.toInt__I = (function() {
  return this.lo$2
});
$c_sjsr_RuntimeLong.prototype.notEquals__sjsr_RuntimeLong__Z = (function(b) {
  return (!((this.lo$2 === b.lo$2) && (this.hi$2 === b.hi$2)))
});
$c_sjsr_RuntimeLong.prototype.unary$und$minus__sjsr_RuntimeLong = (function() {
  var lo = this.lo$2;
  var hi = this.hi$2;
  return new $c_sjsr_RuntimeLong().init___I__I(((-lo) | 0), ((lo !== 0) ? (~hi) : ((-hi) | 0)))
});
$c_sjsr_RuntimeLong.prototype.$$plus__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  var alo = this.lo$2;
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  var lo = ((alo + b.lo$2) | 0);
  return new $c_sjsr_RuntimeLong().init___I__I(lo, ((((-2147483648) ^ lo) < ((-2147483648) ^ alo)) ? ((1 + ((ahi + bhi) | 0)) | 0) : ((ahi + bhi) | 0)))
});
$c_sjsr_RuntimeLong.prototype.shortValue__S = (function() {
  return ((this.lo$2 << 16) >> 16)
});
$c_sjsr_RuntimeLong.prototype.$$greater$greater__I__sjsr_RuntimeLong = (function(n) {
  return new $c_sjsr_RuntimeLong().init___I__I((((32 & n) === 0) ? (((this.lo$2 >>> n) | 0) | ((this.hi$2 << 1) << ((31 - n) | 0))) : (this.hi$2 >> n)), (((32 & n) === 0) ? (this.hi$2 >> n) : (this.hi$2 >> 31)))
});
$c_sjsr_RuntimeLong.prototype.toDouble__D = (function() {
  return $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(this.lo$2, this.hi$2)
});
$c_sjsr_RuntimeLong.prototype.$$div__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  var this$1 = $m_sjsr_RuntimeLong$();
  var lo = this$1.divideImpl__I__I__I__I__I(this.lo$2, this.hi$2, b.lo$2, b.hi$2);
  return new $c_sjsr_RuntimeLong().init___I__I(lo, this$1.scala$scalajs$runtime$RuntimeLong$$hiReturn$f)
});
$c_sjsr_RuntimeLong.prototype.doubleValue__D = (function() {
  return $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(this.lo$2, this.hi$2)
});
$c_sjsr_RuntimeLong.prototype.hashCode__I = (function() {
  return (this.lo$2 ^ this.hi$2)
});
$c_sjsr_RuntimeLong.prototype.intValue__I = (function() {
  return this.lo$2
});
$c_sjsr_RuntimeLong.prototype.unary$und$tilde__sjsr_RuntimeLong = (function() {
  return new $c_sjsr_RuntimeLong().init___I__I((~this.lo$2), (~this.hi$2))
});
$c_sjsr_RuntimeLong.prototype.compareTo__jl_Long__I = (function(that) {
  return $m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$compare__I__I__I__I__I(this.lo$2, this.hi$2, that.lo$2, that.hi$2)
});
$c_sjsr_RuntimeLong.prototype.floatValue__F = (function() {
  return $fround($m_sjsr_RuntimeLong$().scala$scalajs$runtime$RuntimeLong$$toDouble__I__I__D(this.lo$2, this.hi$2))
});
$c_sjsr_RuntimeLong.prototype.$$minus__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  var alo = this.lo$2;
  var ahi = this.hi$2;
  var bhi = b.hi$2;
  var lo = ((alo - b.lo$2) | 0);
  return new $c_sjsr_RuntimeLong().init___I__I(lo, ((((-2147483648) ^ lo) > ((-2147483648) ^ alo)) ? (((-1) + ((ahi - bhi) | 0)) | 0) : ((ahi - bhi) | 0)))
});
$c_sjsr_RuntimeLong.prototype.$$up__sjsr_RuntimeLong__sjsr_RuntimeLong = (function(b) {
  return new $c_sjsr_RuntimeLong().init___I__I((this.lo$2 ^ b.lo$2), (this.hi$2 ^ b.hi$2))
});
$c_sjsr_RuntimeLong.prototype.equals__sjsr_RuntimeLong__Z = (function(b) {
  return ((this.lo$2 === b.lo$2) && (this.hi$2 === b.hi$2))
});
function $is_sjsr_RuntimeLong(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjsr_RuntimeLong)))
}
function $as_sjsr_RuntimeLong(obj) {
  return (($is_sjsr_RuntimeLong(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.runtime.RuntimeLong"))
}
function $isArrayOf_sjsr_RuntimeLong(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjsr_RuntimeLong)))
}
function $asArrayOf_sjsr_RuntimeLong(obj, depth) {
  return (($isArrayOf_sjsr_RuntimeLong(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.runtime.RuntimeLong;", depth))
}
var $d_sjsr_RuntimeLong = new $TypeData().initClass({
  sjsr_RuntimeLong: 0
}, false, "scala.scalajs.runtime.RuntimeLong", {
  sjsr_RuntimeLong: 1,
  jl_Number: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  jl_Comparable: 1
});
$c_sjsr_RuntimeLong.prototype.$classData = $d_sjsr_RuntimeLong;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem() {
  $c_O.call(this);
  this.game$1 = null;
  this.pool$1 = null;
  this.group$1 = null;
  this.width$1 = 0;
  this.height$1 = 0;
  this.pixelFactor$1 = 0;
  this.FireRate$1 = 0.0;
  this.shoot$1 = false;
  this.mouseX$1 = 0;
  this.mouseY$1 = 0;
  this.timeToFire$1 = 0.0;
  this.bitmap$0$1 = false
}
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype = $c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.group__Lcom_darkoverlordofdata_entitas_Group = (function() {
  return ((!this.bitmap$0$1) ? this.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group() : this.group$1)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.initialize__V = (function() {
  $g.gdx.Gdx.input.setInputProcessor(this);
  var pool = this.pool$1;
  new $c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory().init___Lcom_darkoverlordofdata_entitas_Pool(pool).createPlayer__F__F__Lcom_darkoverlordofdata_entitas_Entity($fround(this.width$1), $fround(this.height$1))
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.touchUp__I__I__I__I__Z = (function(screenX, screenY, pointer, button) {
  this.shoot$1 = false;
  return true
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.touchDragged__I__I__I__Z = (function(screenX, screenY, pointer) {
  this.moveTo__I__I__V(screenX, screenY);
  return false
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.touchDown__I__I__I__I__Z = (function(screenX, screenY, pointer, button) {
  this.shoot$1 = true;
  this.moveTo__I__I__V(screenX, screenY);
  return false
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.init___Lcom_darkoverlordofdata_demo_GameScene__Lcom_darkoverlordofdata_entitas_Pool = (function(game, pool) {
  this.game$1 = game;
  this.pool$1 = pool;
  var this$2 = $m_s_Console$();
  var this$3 = $as_Ljava_io_PrintStream(this$2.outVar$2.v$1);
  this$3.java$lang$JSConsoleBasedPrintStream$$printString__T__V("PlayerInputSystem\n");
  this.width$1 = game.width__I();
  this.height$1 = game.height__I();
  this.pixelFactor$1 = game.pixelFactor__I();
  this.FireRate$1 = 0.10000000149011612;
  this.shoot$1 = false;
  this.mouseX$1 = 0;
  this.mouseY$1 = 0;
  this.timeToFire$1 = 0.0;
  return this
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.$$js$exported$meth$touchDragged__I__I__I__O = (function(screenX, screenY, pointer) {
  return this.touchDragged__I__I__I__Z(screenX, screenY, pointer)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.$$js$exported$meth$touchDown__I__I__I__I__O = (function(screenX, screenY, pointer, button) {
  return this.touchDown__I__I__I__I__Z(screenX, screenY, pointer, button)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.$$js$exported$meth$mouseMoved__I__I__O = (function(screenX, screenY) {
  return this.mouseMoved__I__I__Z(screenX, screenY)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.$$js$exported$meth$keyDown__I__O = (function(keycode) {
  return this.keyDown__I__Z(keycode)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.keyDown__I__Z = (function(keycode) {
  if (($uD($g.gdx.Input.Keys.Z) === keycode)) {
    this.shoot$1 = true
  };
  return true
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.mouseMoved__I__I__Z = (function(screenX, screenY) {
  this.moveTo__I__I__V(screenX, screenY);
  return false
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.$$js$exported$meth$keyUp__I__O = (function(keycode) {
  return this.keyUp__I__Z(keycode)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.execute__V = (function() {
  var player = this.group__Lcom_darkoverlordofdata_entitas_Group().singleEntity__Lcom_darkoverlordofdata_entitas_Entity();
  if ((player !== null)) {
    ($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(player)).position__Lcom_darkoverlordofdata_demo_PositionComponent();
    $m_Lcom_darkoverlordofdata_demo_EntityExtensions$();
    var jsx$1 = new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(player);
    var x = $fround(this.mouseX$1);
    var y = $fround(this.mouseY$1);
    jsx$1.updatePosition__Lcom_darkoverlordofdata_demo_PositionComponent__Lcom_darkoverlordofdata_entitas_Entity(new $c_Lcom_darkoverlordofdata_demo_PositionComponent().init___F__F(x, y));
    if (this.shoot$1) {
      this.timeToFire$1 = $fround((this.timeToFire$1 - $uF($g.gdx.Gdx.graphics.getDeltaTime())));
      if ((this.timeToFire$1 < 0.0)) {
        var pool = this.pool$1;
        new $c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory().init___Lcom_darkoverlordofdata_entitas_Pool(pool).createBullet__F__F__Lcom_darkoverlordofdata_entitas_Entity($fround(((-27.0) + $fround(this.mouseX$1))), $fround(((-10.0) + $fround(this.mouseY$1))));
        var pool$1 = this.pool$1;
        new $c_Lcom_darkoverlordofdata_demo_Factory$EntityFactory().init___Lcom_darkoverlordofdata_entitas_Pool(pool$1).createBullet__F__F__Lcom_darkoverlordofdata_entitas_Entity($fround((27.0 + $fround(this.mouseX$1))), $fround(((-10.0) + $fround(this.mouseY$1))));
        this.timeToFire$1 = this.FireRate$1
      }
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.moveTo__I__I__V = (function(x, y) {
  this.mouseX$1 = ((x / this.pixelFactor$1) | 0);
  this.mouseY$1 = ((this.height$1 - ((y / this.pixelFactor$1) | 0)) | 0)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.group$lzycompute__p1__Lcom_darkoverlordofdata_entitas_Group = (function() {
  if ((!this.bitmap$0$1)) {
    this.group$1 = this.pool$1.getGroup__Lcom_darkoverlordofdata_entitas_IMatcher__Lcom_darkoverlordofdata_entitas_Group($m_Lcom_darkoverlordofdata_demo_Match$().Player$1);
    this.bitmap$0$1 = true
  };
  return this.group$1
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.keyUp__I__Z = (function(keycode) {
  if (($uD($g.gdx.Input.Keys.Z) === keycode)) {
    this.shoot$1 = false
  };
  return true
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.$$js$exported$meth$touchUp__I__I__I__I__O = (function(screenX, screenY, pointer, button) {
  return this.touchUp__I__I__I__I__Z(screenX, screenY, pointer, button)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.touchDragged = (function(arg$1, arg$2, arg$3) {
  var prep0 = $uI(arg$1);
  var prep1 = $uI(arg$2);
  var prep2 = $uI(arg$3);
  return this.$$js$exported$meth$touchDragged__I__I__I__O(prep0, prep1, prep2)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.touchUp = (function(arg$1, arg$2, arg$3, arg$4) {
  var prep0 = $uI(arg$1);
  var prep1 = $uI(arg$2);
  var prep2 = $uI(arg$3);
  var prep3 = $uI(arg$4);
  return this.$$js$exported$meth$touchUp__I__I__I__I__O(prep0, prep1, prep2, prep3)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.keyUp = (function(arg$1) {
  var prep0 = $uI(arg$1);
  return this.$$js$exported$meth$keyUp__I__O(prep0)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.touchDown = (function(arg$1, arg$2, arg$3, arg$4) {
  var prep0 = $uI(arg$1);
  var prep1 = $uI(arg$2);
  var prep2 = $uI(arg$3);
  var prep3 = $uI(arg$4);
  return this.$$js$exported$meth$touchDown__I__I__I__I__O(prep0, prep1, prep2, prep3)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.keyDown = (function(arg$1) {
  var prep0 = $uI(arg$1);
  return this.$$js$exported$meth$keyDown__I__O(prep0)
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.mouseMoved = (function(arg$1, arg$2) {
  var prep0 = $uI(arg$1);
  var prep1 = $uI(arg$2);
  return this.$$js$exported$meth$mouseMoved__I__I__O(prep0, prep1)
});
var $d_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem: 0
}, false, "com.darkoverlordofdata.demo.systems.PlayerInputSystem", {
  Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IExecuteSystem: 1,
  Lcom_darkoverlordofdata_entitas_ISystem: 1,
  Lcom_darkoverlordofdata_entitas_IInitializeSystem: 1,
  Lcom_badlogic_gdx_InputProcessor: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_PlayerInputSystem;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null
}
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1.prototype = new $h_sr_AbstractFunction1();
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1.prototype = $c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1.prototype.apply__Lcom_darkoverlordofdata_entitas_GroupChangedArgs__V = (function(e) {
  var jsx$1 = this.$$outer$2;
  var this$2 = this.$$outer$2.sprites$1.$$plus$eq__O__scm_ListBuffer(e.entity$1);
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function(x$1$2) {
    var x$1 = $as_Lcom_darkoverlordofdata_entitas_Entity(x$1$2);
    return ((-($m_Lcom_darkoverlordofdata_demo_EntityExtensions$(), new $c_Lcom_darkoverlordofdata_demo_EntityExtensions$ExtendEntity().init___Lcom_darkoverlordofdata_entitas_Entity(x$1)).layer__Lcom_darkoverlordofdata_demo_LayerComponent().ordinal$1) | 0)
  }));
  var ord = $m_s_math_Ordering$Int$();
  jsx$1.sprites$1 = $as_scm_ListBuffer($s_sc_SeqLike$class__sortBy__sc_SeqLike__F1__s_math_Ordering__O(this$2, f, ord))
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1.prototype.apply__O__O = (function(v1) {
  this.apply__Lcom_darkoverlordofdata_entitas_GroupChangedArgs__V($as_Lcom_darkoverlordofdata_entitas_GroupChangedArgs(v1))
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1.prototype.init___Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  return this
});
var $d_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1 = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1: 0
}, false, "com.darkoverlordofdata.demo.systems.SpriteRenderSystem$$anonfun$1", {
  Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_SpriteRenderSystem$$anonfun$1;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null
}
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2.prototype = new $h_sr_AbstractFunction1();
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2.prototype = $c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2.prototype;
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2.prototype.apply__O__O = (function(v1) {
  this.apply__Lcom_darkoverlordofdata_entitas_EntityChangedArgs__V($as_Lcom_darkoverlordofdata_entitas_EntityChangedArgs(v1))
});
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2.prototype.init___Lcom_darkoverlordofdata_entitas_Pool = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2.prototype.apply__Lcom_darkoverlordofdata_entitas_EntityChangedArgs__V = (function(e) {
  if (this.$$outer$2.com$darkoverlordofdata$entitas$Pool$$$undgroupsForIndex$1.contains__O__Z(e.index$1)) {
    var this$1 = $as_sc_SeqLike(this.$$outer$2.com$darkoverlordofdata$entitas$Pool$$$undgroupsForIndex$1.apply__O__O(e.index$1)).indices__sci_Range();
    if ((!this$1.isEmpty$4)) {
      var i = this$1.start$4;
      while (true) {
        var v1 = i;
        var this$2 = $as_scm_ResizableArray(this.$$outer$2.com$darkoverlordofdata$entitas$Pool$$$undgroupsForIndex$1.apply__O__O(e.index$1));
        var group = $as_Lcom_darkoverlordofdata_entitas_Group($s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(this$2, v1));
        if ((e.component$1 !== null)) {
          group.handleEntity__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__V(e.entity$1, e.index$1, e.component$1)
        };
        if ((i === this$1.lastElement$4)) {
          break
        };
        i = ((i + this$1.step$4) | 0)
      }
    }
  }
});
var $d_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2 = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2: 0
}, false, "com.darkoverlordofdata.entitas.Pool$$anonfun$2", {
  Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$2;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3() {
  $c_sr_AbstractFunction1.call(this);
  this.$$outer$2 = null
}
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3.prototype = new $h_sr_AbstractFunction1();
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3.prototype = $c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3.prototype;
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3.prototype.apply__O__O = (function(v1) {
  this.apply__Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs__V($as_Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs(v1))
});
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3.prototype.apply__Lcom_darkoverlordofdata_entitas_ComponentReplacedArgs__V = (function(e) {
  if (this.$$outer$2.com$darkoverlordofdata$entitas$Pool$$$undgroupsForIndex$1.contains__O__Z(e.index$1)) {
    var this$1 = $as_sc_SeqLike(this.$$outer$2.com$darkoverlordofdata$entitas$Pool$$$undgroupsForIndex$1.apply__O__O(e.index$1)).indices__sci_Range();
    if ((!this$1.isEmpty$4)) {
      var i = this$1.start$4;
      while (true) {
        var v1 = i;
        var this$2 = $as_scm_ResizableArray(this.$$outer$2.com$darkoverlordofdata$entitas$Pool$$$undgroupsForIndex$1.apply__O__O(e.index$1));
        var group = $as_Lcom_darkoverlordofdata_entitas_Group($s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(this$2, v1));
        group.updateEntity__Lcom_darkoverlordofdata_entitas_Entity__I__Lcom_darkoverlordofdata_entitas_IComponent__Lcom_darkoverlordofdata_entitas_IComponent__V(e.entity$1, e.index$1, e.previous$1, e.replacement$1);
        if ((i === this$1.lastElement$4)) {
          break
        };
        i = ((i + this$1.step$4) | 0)
      }
    }
  }
});
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3.prototype.init___Lcom_darkoverlordofdata_entitas_Pool = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  return this
});
var $d_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3 = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3: 0
}, false, "com.darkoverlordofdata.entitas.Pool$$anonfun$3", {
  Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3: 1,
  sr_AbstractFunction1: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_Pool$$anonfun$3;
/** @constructor */
function $c_jl_ArithmeticException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_ArithmeticException.prototype = new $h_jl_RuntimeException();
$c_jl_ArithmeticException.prototype.constructor = $c_jl_ArithmeticException;
/** @constructor */
function $h_jl_ArithmeticException() {
  /*<skip>*/
}
$h_jl_ArithmeticException.prototype = $c_jl_ArithmeticException.prototype;
$c_jl_ArithmeticException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_ArithmeticException = new $TypeData().initClass({
  jl_ArithmeticException: 0
}, false, "java.lang.ArithmeticException", {
  jl_ArithmeticException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_ArithmeticException.prototype.$classData = $d_jl_ArithmeticException;
/** @constructor */
function $c_jl_ClassCastException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_ClassCastException.prototype = new $h_jl_RuntimeException();
$c_jl_ClassCastException.prototype.constructor = $c_jl_ClassCastException;
/** @constructor */
function $h_jl_ClassCastException() {
  /*<skip>*/
}
$h_jl_ClassCastException.prototype = $c_jl_ClassCastException.prototype;
$c_jl_ClassCastException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
function $is_jl_ClassCastException(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.jl_ClassCastException)))
}
function $as_jl_ClassCastException(obj) {
  return (($is_jl_ClassCastException(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.lang.ClassCastException"))
}
function $isArrayOf_jl_ClassCastException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.jl_ClassCastException)))
}
function $asArrayOf_jl_ClassCastException(obj, depth) {
  return (($isArrayOf_jl_ClassCastException(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.lang.ClassCastException;", depth))
}
var $d_jl_ClassCastException = new $TypeData().initClass({
  jl_ClassCastException: 0
}, false, "java.lang.ClassCastException", {
  jl_ClassCastException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_ClassCastException.prototype.$classData = $d_jl_ClassCastException;
/** @constructor */
function $c_jl_IllegalArgumentException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_IllegalArgumentException.prototype = new $h_jl_RuntimeException();
$c_jl_IllegalArgumentException.prototype.constructor = $c_jl_IllegalArgumentException;
/** @constructor */
function $h_jl_IllegalArgumentException() {
  /*<skip>*/
}
$h_jl_IllegalArgumentException.prototype = $c_jl_IllegalArgumentException.prototype;
$c_jl_IllegalArgumentException.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_jl_IllegalArgumentException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_IllegalArgumentException = new $TypeData().initClass({
  jl_IllegalArgumentException: 0
}, false, "java.lang.IllegalArgumentException", {
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_IllegalArgumentException.prototype.$classData = $d_jl_IllegalArgumentException;
/** @constructor */
function $c_jl_IndexOutOfBoundsException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_IndexOutOfBoundsException.prototype = new $h_jl_RuntimeException();
$c_jl_IndexOutOfBoundsException.prototype.constructor = $c_jl_IndexOutOfBoundsException;
/** @constructor */
function $h_jl_IndexOutOfBoundsException() {
  /*<skip>*/
}
$h_jl_IndexOutOfBoundsException.prototype = $c_jl_IndexOutOfBoundsException.prototype;
$c_jl_IndexOutOfBoundsException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_IndexOutOfBoundsException = new $TypeData().initClass({
  jl_IndexOutOfBoundsException: 0
}, false, "java.lang.IndexOutOfBoundsException", {
  jl_IndexOutOfBoundsException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_IndexOutOfBoundsException.prototype.$classData = $d_jl_IndexOutOfBoundsException;
/** @constructor */
function $c_jl_NullPointerException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_NullPointerException.prototype = new $h_jl_RuntimeException();
$c_jl_NullPointerException.prototype.constructor = $c_jl_NullPointerException;
/** @constructor */
function $h_jl_NullPointerException() {
  /*<skip>*/
}
$h_jl_NullPointerException.prototype = $c_jl_NullPointerException.prototype;
$c_jl_NullPointerException.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
var $d_jl_NullPointerException = new $TypeData().initClass({
  jl_NullPointerException: 0
}, false, "java.lang.NullPointerException", {
  jl_NullPointerException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_NullPointerException.prototype.$classData = $d_jl_NullPointerException;
/** @constructor */
function $c_jl_UnsupportedOperationException() {
  $c_jl_RuntimeException.call(this)
}
$c_jl_UnsupportedOperationException.prototype = new $h_jl_RuntimeException();
$c_jl_UnsupportedOperationException.prototype.constructor = $c_jl_UnsupportedOperationException;
/** @constructor */
function $h_jl_UnsupportedOperationException() {
  /*<skip>*/
}
$h_jl_UnsupportedOperationException.prototype = $c_jl_UnsupportedOperationException.prototype;
$c_jl_UnsupportedOperationException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_jl_UnsupportedOperationException = new $TypeData().initClass({
  jl_UnsupportedOperationException: 0
}, false, "java.lang.UnsupportedOperationException", {
  jl_UnsupportedOperationException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_jl_UnsupportedOperationException.prototype.$classData = $d_jl_UnsupportedOperationException;
/** @constructor */
function $c_ju_NoSuchElementException() {
  $c_jl_RuntimeException.call(this)
}
$c_ju_NoSuchElementException.prototype = new $h_jl_RuntimeException();
$c_ju_NoSuchElementException.prototype.constructor = $c_ju_NoSuchElementException;
/** @constructor */
function $h_ju_NoSuchElementException() {
  /*<skip>*/
}
$h_ju_NoSuchElementException.prototype = $c_ju_NoSuchElementException.prototype;
$c_ju_NoSuchElementException.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_ju_NoSuchElementException.prototype.init___T = (function(s) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_ju_NoSuchElementException = new $TypeData().initClass({
  ju_NoSuchElementException: 0
}, false, "java.util.NoSuchElementException", {
  ju_NoSuchElementException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_ju_NoSuchElementException.prototype.$classData = $d_ju_NoSuchElementException;
/** @constructor */
function $c_s_Enumeration$Value() {
  $c_O.call(this);
  this.scala$Enumeration$$outerEnum$1 = null;
  this.$$outer$f = null
}
$c_s_Enumeration$Value.prototype = new $h_O();
$c_s_Enumeration$Value.prototype.constructor = $c_s_Enumeration$Value;
/** @constructor */
function $h_s_Enumeration$Value() {
  /*<skip>*/
}
$h_s_Enumeration$Value.prototype = $c_s_Enumeration$Value.prototype;
$c_s_Enumeration$Value.prototype.equals__O__Z = (function(other) {
  if ($is_s_Enumeration$Value(other)) {
    var x2 = $as_s_Enumeration$Value(other);
    return ((this.scala$Enumeration$$outerEnum$1 === x2.scala$Enumeration$$outerEnum$1) && (this.i$2 === x2.i$2))
  } else {
    return false
  }
});
$c_s_Enumeration$Value.prototype.init___s_Enumeration = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  this.scala$Enumeration$$outerEnum$1 = $$outer;
  return this
});
$c_s_Enumeration$Value.prototype.hashCode__I = (function() {
  return this.i$2
});
function $is_s_Enumeration$Value(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_Enumeration$Value)))
}
function $as_s_Enumeration$Value(obj) {
  return (($is_s_Enumeration$Value(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Enumeration$Value"))
}
function $isArrayOf_s_Enumeration$Value(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_Enumeration$Value)))
}
function $asArrayOf_s_Enumeration$Value(obj, depth) {
  return (($isArrayOf_s_Enumeration$Value(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Enumeration$Value;", depth))
}
/** @constructor */
function $c_s_MatchError() {
  $c_jl_RuntimeException.call(this);
  this.obj$4 = null;
  this.objString$4 = null;
  this.bitmap$0$4 = false
}
$c_s_MatchError.prototype = new $h_jl_RuntimeException();
$c_s_MatchError.prototype.constructor = $c_s_MatchError;
/** @constructor */
function $h_s_MatchError() {
  /*<skip>*/
}
$h_s_MatchError.prototype = $c_s_MatchError.prototype;
$c_s_MatchError.prototype.objString$lzycompute__p4__T = (function() {
  if ((!this.bitmap$0$4)) {
    this.objString$4 = ((this.obj$4 === null) ? "null" : this.liftedTree1$1__p4__T());
    this.bitmap$0$4 = true
  };
  return this.objString$4
});
$c_s_MatchError.prototype.ofClass$1__p4__T = (function() {
  var this$1 = this.obj$4;
  return ("of class " + $objectGetClass(this$1).getName__T())
});
$c_s_MatchError.prototype.liftedTree1$1__p4__T = (function() {
  try {
    return ((($objectToString(this.obj$4) + " (") + this.ofClass$1__p4__T()) + ")")
  } catch (e) {
    var e$2 = $m_sjsr_package$().wrapJavaScriptException__O__jl_Throwable(e);
    if ((e$2 !== null)) {
      return ("an instance " + this.ofClass$1__p4__T())
    } else {
      throw e
    }
  }
});
$c_s_MatchError.prototype.getMessage__T = (function() {
  return this.objString__p4__T()
});
$c_s_MatchError.prototype.objString__p4__T = (function() {
  return ((!this.bitmap$0$4) ? this.objString$lzycompute__p4__T() : this.objString$4)
});
$c_s_MatchError.prototype.init___O = (function(obj) {
  this.obj$4 = obj;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
var $d_s_MatchError = new $TypeData().initClass({
  s_MatchError: 0
}, false, "scala.MatchError", {
  s_MatchError: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_s_MatchError.prototype.$classData = $d_s_MatchError;
/** @constructor */
function $c_s_Option() {
  $c_O.call(this)
}
$c_s_Option.prototype = new $h_O();
$c_s_Option.prototype.constructor = $c_s_Option;
/** @constructor */
function $h_s_Option() {
  /*<skip>*/
}
$h_s_Option.prototype = $c_s_Option.prototype;
/** @constructor */
function $c_s_Predef$$anon$1() {
  $c_s_Predef$$less$colon$less.call(this)
}
$c_s_Predef$$anon$1.prototype = new $h_s_Predef$$less$colon$less();
$c_s_Predef$$anon$1.prototype.constructor = $c_s_Predef$$anon$1;
/** @constructor */
function $h_s_Predef$$anon$1() {
  /*<skip>*/
}
$h_s_Predef$$anon$1.prototype = $c_s_Predef$$anon$1.prototype;
$c_s_Predef$$anon$1.prototype.init___ = (function() {
  return this
});
$c_s_Predef$$anon$1.prototype.apply__O__O = (function(x) {
  return x
});
var $d_s_Predef$$anon$1 = new $TypeData().initClass({
  s_Predef$$anon$1: 0
}, false, "scala.Predef$$anon$1", {
  s_Predef$$anon$1: 1,
  s_Predef$$less$colon$less: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Predef$$anon$1.prototype.$classData = $d_s_Predef$$anon$1;
/** @constructor */
function $c_s_Predef$$anon$2() {
  $c_s_Predef$$eq$colon$eq.call(this)
}
$c_s_Predef$$anon$2.prototype = new $h_s_Predef$$eq$colon$eq();
$c_s_Predef$$anon$2.prototype.constructor = $c_s_Predef$$anon$2;
/** @constructor */
function $h_s_Predef$$anon$2() {
  /*<skip>*/
}
$h_s_Predef$$anon$2.prototype = $c_s_Predef$$anon$2.prototype;
$c_s_Predef$$anon$2.prototype.init___ = (function() {
  return this
});
$c_s_Predef$$anon$2.prototype.apply__O__O = (function(x) {
  return x
});
var $d_s_Predef$$anon$2 = new $TypeData().initClass({
  s_Predef$$anon$2: 0
}, false, "scala.Predef$$anon$2", {
  s_Predef$$anon$2: 1,
  s_Predef$$eq$colon$eq: 1,
  O: 1,
  F1: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Predef$$anon$2.prototype.$classData = $d_s_Predef$$anon$2;
/** @constructor */
function $c_s_StringContext() {
  $c_O.call(this);
  this.parts$1 = null
}
$c_s_StringContext.prototype = new $h_O();
$c_s_StringContext.prototype.constructor = $c_s_StringContext;
/** @constructor */
function $h_s_StringContext() {
  /*<skip>*/
}
$h_s_StringContext.prototype = $c_s_StringContext.prototype;
$c_s_StringContext.prototype.productPrefix__T = (function() {
  return "StringContext"
});
$c_s_StringContext.prototype.productArity__I = (function() {
  return 1
});
$c_s_StringContext.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_StringContext(x$1)) {
    var StringContext$1 = $as_s_StringContext(x$1);
    var x = this.parts$1;
    var x$2 = StringContext$1.parts$1;
    return ((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))
  } else {
    return false
  }
});
$c_s_StringContext.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.parts$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_StringContext.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_s_StringContext.prototype.checkLengths__sc_Seq__V = (function(args) {
  if ((this.parts$1.length__I() !== ((1 + args.length__I()) | 0))) {
    throw new $c_jl_IllegalArgumentException().init___T((((("wrong number of arguments (" + args.length__I()) + ") for interpolated string with ") + this.parts$1.length__I()) + " parts"))
  }
});
$c_s_StringContext.prototype.s__sc_Seq__T = (function(args) {
  var f = (function($this) {
    return (function(str$2) {
      var str = $as_T(str$2);
      var this$1 = $m_s_StringContext$();
      return this$1.treatEscapes0__p1__T__Z__T(str, false)
    })
  })(this);
  this.checkLengths__sc_Seq__V(args);
  var pi = this.parts$1.iterator__sc_Iterator();
  var ai = args.iterator__sc_Iterator();
  var arg1 = pi.next__O();
  var bldr = new $c_jl_StringBuilder().init___T($as_T(f(arg1)));
  while (ai.hasNext__Z()) {
    bldr.append__O__jl_StringBuilder(ai.next__O());
    var arg1$1 = pi.next__O();
    bldr.append__T__jl_StringBuilder($as_T(f(arg1$1)))
  };
  return bldr.content$1
});
$c_s_StringContext.prototype.init___sc_Seq = (function(parts) {
  this.parts$1 = parts;
  return this
});
$c_s_StringContext.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_StringContext.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_StringContext(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_StringContext)))
}
function $as_s_StringContext(obj) {
  return (($is_s_StringContext(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.StringContext"))
}
function $isArrayOf_s_StringContext(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_StringContext)))
}
function $asArrayOf_s_StringContext(obj, depth) {
  return (($isArrayOf_s_StringContext(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.StringContext;", depth))
}
var $d_s_StringContext = new $TypeData().initClass({
  s_StringContext: 0
}, false, "scala.StringContext", {
  s_StringContext: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_StringContext.prototype.$classData = $d_s_StringContext;
function $is_s_reflect_ClassTag(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_reflect_ClassTag)))
}
function $as_s_reflect_ClassTag(obj) {
  return (($is_s_reflect_ClassTag(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.reflect.ClassTag"))
}
function $isArrayOf_s_reflect_ClassTag(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_reflect_ClassTag)))
}
function $asArrayOf_s_reflect_ClassTag(obj, depth) {
  return (($isArrayOf_s_reflect_ClassTag(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.reflect.ClassTag;", depth))
}
/** @constructor */
function $c_s_util_control_BreakControl() {
  $c_jl_Throwable.call(this)
}
$c_s_util_control_BreakControl.prototype = new $h_jl_Throwable();
$c_s_util_control_BreakControl.prototype.constructor = $c_s_util_control_BreakControl;
/** @constructor */
function $h_s_util_control_BreakControl() {
  /*<skip>*/
}
$h_s_util_control_BreakControl.prototype = $c_s_util_control_BreakControl.prototype;
$c_s_util_control_BreakControl.prototype.init___ = (function() {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_s_util_control_BreakControl.prototype.fillInStackTrace__jl_Throwable = (function() {
  return $s_s_util_control_NoStackTrace$class__fillInStackTrace__s_util_control_NoStackTrace__jl_Throwable(this)
});
var $d_s_util_control_BreakControl = new $TypeData().initClass({
  s_util_control_BreakControl: 0
}, false, "scala.util.control.BreakControl", {
  s_util_control_BreakControl: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_util_control_ControlThrowable: 1,
  s_util_control_NoStackTrace: 1
});
$c_s_util_control_BreakControl.prototype.$classData = $d_s_util_control_BreakControl;
function $is_sc_GenTraversable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenTraversable)))
}
function $as_sc_GenTraversable(obj) {
  return (($is_sc_GenTraversable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenTraversable"))
}
function $isArrayOf_sc_GenTraversable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenTraversable)))
}
function $asArrayOf_sc_GenTraversable(obj, depth) {
  return (($isArrayOf_sc_GenTraversable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenTraversable;", depth))
}
/** @constructor */
function $c_sc_Iterable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sc_Iterable$.prototype = new $h_scg_GenTraversableFactory();
$c_sc_Iterable$.prototype.constructor = $c_sc_Iterable$;
/** @constructor */
function $h_sc_Iterable$() {
  /*<skip>*/
}
$h_sc_Iterable$.prototype = $c_sc_Iterable$.prototype;
$c_sc_Iterable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sc_Iterable$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Iterable$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Iterable$ = new $TypeData().initClass({
  sc_Iterable$: 0
}, false, "scala.collection.Iterable$", {
  sc_Iterable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Iterable$.prototype.$classData = $d_sc_Iterable$;
var $n_sc_Iterable$ = (void 0);
function $m_sc_Iterable$() {
  if ((!$n_sc_Iterable$)) {
    $n_sc_Iterable$ = new $c_sc_Iterable$().init___()
  };
  return $n_sc_Iterable$
}
/** @constructor */
function $c_sc_Iterator$$anon$11() {
  $c_sc_AbstractIterator.call(this);
  this.$$outer$2 = null;
  this.f$3$2 = null
}
$c_sc_Iterator$$anon$11.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$11.prototype.constructor = $c_sc_Iterator$$anon$11;
/** @constructor */
function $h_sc_Iterator$$anon$11() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$11.prototype = $c_sc_Iterator$$anon$11.prototype;
$c_sc_Iterator$$anon$11.prototype.next__O = (function() {
  return this.f$3$2.apply__O__O(this.$$outer$2.next__O())
});
$c_sc_Iterator$$anon$11.prototype.init___sc_Iterator__F1 = (function($$outer, f$3) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.f$3$2 = f$3;
  return this
});
$c_sc_Iterator$$anon$11.prototype.hasNext__Z = (function() {
  return this.$$outer$2.hasNext__Z()
});
var $d_sc_Iterator$$anon$11 = new $TypeData().initClass({
  sc_Iterator$$anon$11: 0
}, false, "scala.collection.Iterator$$anon$11", {
  sc_Iterator$$anon$11: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$11.prototype.$classData = $d_sc_Iterator$$anon$11;
/** @constructor */
function $c_sc_Iterator$$anon$2() {
  $c_sc_AbstractIterator.call(this)
}
$c_sc_Iterator$$anon$2.prototype = new $h_sc_AbstractIterator();
$c_sc_Iterator$$anon$2.prototype.constructor = $c_sc_Iterator$$anon$2;
/** @constructor */
function $h_sc_Iterator$$anon$2() {
  /*<skip>*/
}
$h_sc_Iterator$$anon$2.prototype = $c_sc_Iterator$$anon$2.prototype;
$c_sc_Iterator$$anon$2.prototype.init___ = (function() {
  return this
});
$c_sc_Iterator$$anon$2.prototype.next__O = (function() {
  this.next__sr_Nothing$()
});
$c_sc_Iterator$$anon$2.prototype.next__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("next on empty iterator")
});
$c_sc_Iterator$$anon$2.prototype.hasNext__Z = (function() {
  return false
});
var $d_sc_Iterator$$anon$2 = new $TypeData().initClass({
  sc_Iterator$$anon$2: 0
}, false, "scala.collection.Iterator$$anon$2", {
  sc_Iterator$$anon$2: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_Iterator$$anon$2.prototype.$classData = $d_sc_Iterator$$anon$2;
/** @constructor */
function $c_sc_LinearSeqLike$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.these$2 = null
}
$c_sc_LinearSeqLike$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sc_LinearSeqLike$$anon$1.prototype.constructor = $c_sc_LinearSeqLike$$anon$1;
/** @constructor */
function $h_sc_LinearSeqLike$$anon$1() {
  /*<skip>*/
}
$h_sc_LinearSeqLike$$anon$1.prototype = $c_sc_LinearSeqLike$$anon$1.prototype;
$c_sc_LinearSeqLike$$anon$1.prototype.init___sc_LinearSeqLike = (function($$outer) {
  this.these$2 = $$outer;
  return this
});
$c_sc_LinearSeqLike$$anon$1.prototype.next__O = (function() {
  if (this.hasNext__Z()) {
    var result = this.these$2.head__O();
    this.these$2 = $as_sc_LinearSeqLike(this.these$2.tail__O());
    return result
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_sc_LinearSeqLike$$anon$1.prototype.hasNext__Z = (function() {
  return (!this.these$2.isEmpty__Z())
});
var $d_sc_LinearSeqLike$$anon$1 = new $TypeData().initClass({
  sc_LinearSeqLike$$anon$1: 0
}, false, "scala.collection.LinearSeqLike$$anon$1", {
  sc_LinearSeqLike$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sc_LinearSeqLike$$anon$1.prototype.$classData = $d_sc_LinearSeqLike$$anon$1;
/** @constructor */
function $c_sc_Traversable$() {
  $c_scg_GenTraversableFactory.call(this);
  this.breaks$3 = null
}
$c_sc_Traversable$.prototype = new $h_scg_GenTraversableFactory();
$c_sc_Traversable$.prototype.constructor = $c_sc_Traversable$;
/** @constructor */
function $h_sc_Traversable$() {
  /*<skip>*/
}
$h_sc_Traversable$.prototype = $c_sc_Traversable$.prototype;
$c_sc_Traversable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  $n_sc_Traversable$ = this;
  this.breaks$3 = new $c_s_util_control_Breaks().init___();
  return this
});
$c_sc_Traversable$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Traversable$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Traversable$ = new $TypeData().initClass({
  sc_Traversable$: 0
}, false, "scala.collection.Traversable$", {
  sc_Traversable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Traversable$.prototype.$classData = $d_sc_Traversable$;
var $n_sc_Traversable$ = (void 0);
function $m_sc_Traversable$() {
  if ((!$n_sc_Traversable$)) {
    $n_sc_Traversable$ = new $c_sc_Traversable$().init___()
  };
  return $n_sc_Traversable$
}
/** @constructor */
function $c_scg_ImmutableSetFactory() {
  $c_scg_SetFactory.call(this)
}
$c_scg_ImmutableSetFactory.prototype = new $h_scg_SetFactory();
$c_scg_ImmutableSetFactory.prototype.constructor = $c_scg_ImmutableSetFactory;
/** @constructor */
function $h_scg_ImmutableSetFactory() {
  /*<skip>*/
}
$h_scg_ImmutableSetFactory.prototype = $c_scg_ImmutableSetFactory.prototype;
$c_scg_ImmutableSetFactory.prototype.empty__sc_GenTraversable = (function() {
  return this.emptyInstance__sci_Set()
});
$c_scg_ImmutableSetFactory.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_SetBuilder().init___sc_Set(this.emptyInstance__sci_Set())
});
/** @constructor */
function $c_scg_MutableSetFactory() {
  $c_scg_SetFactory.call(this)
}
$c_scg_MutableSetFactory.prototype = new $h_scg_SetFactory();
$c_scg_MutableSetFactory.prototype.constructor = $c_scg_MutableSetFactory;
/** @constructor */
function $h_scg_MutableSetFactory() {
  /*<skip>*/
}
$h_scg_MutableSetFactory.prototype = $c_scg_MutableSetFactory.prototype;
$c_scg_MutableSetFactory.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_GrowingBuilder().init___scg_Growable($as_scg_Growable(this.empty__sc_GenTraversable()))
});
/** @constructor */
function $c_sci_Iterable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sci_Iterable$.prototype = new $h_scg_GenTraversableFactory();
$c_sci_Iterable$.prototype.constructor = $c_sci_Iterable$;
/** @constructor */
function $h_sci_Iterable$() {
  /*<skip>*/
}
$h_sci_Iterable$.prototype = $c_sci_Iterable$.prototype;
$c_sci_Iterable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sci_Iterable$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Iterable$ = new $TypeData().initClass({
  sci_Iterable$: 0
}, false, "scala.collection.immutable.Iterable$", {
  sci_Iterable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Iterable$.prototype.$classData = $d_sci_Iterable$;
var $n_sci_Iterable$ = (void 0);
function $m_sci_Iterable$() {
  if ((!$n_sci_Iterable$)) {
    $n_sci_Iterable$ = new $c_sci_Iterable$().init___()
  };
  return $n_sci_Iterable$
}
/** @constructor */
function $c_sci_ListSet$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.that$2 = null
}
$c_sci_ListSet$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sci_ListSet$$anon$1.prototype.constructor = $c_sci_ListSet$$anon$1;
/** @constructor */
function $h_sci_ListSet$$anon$1() {
  /*<skip>*/
}
$h_sci_ListSet$$anon$1.prototype = $c_sci_ListSet$$anon$1.prototype;
$c_sci_ListSet$$anon$1.prototype.next__O = (function() {
  var this$1 = this.that$2;
  if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)) {
    var res = this.that$2.head__O();
    this.that$2 = this.that$2.tail__sci_ListSet();
    return res
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_sci_ListSet$$anon$1.prototype.init___sci_ListSet = (function($$outer) {
  this.that$2 = $$outer;
  return this
});
$c_sci_ListSet$$anon$1.prototype.hasNext__Z = (function() {
  var this$1 = this.that$2;
  return $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)
});
var $d_sci_ListSet$$anon$1 = new $TypeData().initClass({
  sci_ListSet$$anon$1: 0
}, false, "scala.collection.immutable.ListSet$$anon$1", {
  sci_ListSet$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_ListSet$$anon$1.prototype.$classData = $d_sci_ListSet$$anon$1;
/** @constructor */
function $c_sci_Stream$StreamBuilder() {
  $c_scm_LazyBuilder.call(this)
}
$c_sci_Stream$StreamBuilder.prototype = new $h_scm_LazyBuilder();
$c_sci_Stream$StreamBuilder.prototype.constructor = $c_sci_Stream$StreamBuilder;
/** @constructor */
function $h_sci_Stream$StreamBuilder() {
  /*<skip>*/
}
$h_sci_Stream$StreamBuilder.prototype = $c_sci_Stream$StreamBuilder.prototype;
$c_sci_Stream$StreamBuilder.prototype.init___ = (function() {
  $c_scm_LazyBuilder.prototype.init___.call(this);
  return this
});
$c_sci_Stream$StreamBuilder.prototype.result__O = (function() {
  return this.result__sci_Stream()
});
$c_sci_Stream$StreamBuilder.prototype.result__sci_Stream = (function() {
  var this$1 = this.parts$1;
  return $as_sci_Stream(this$1.scala$collection$mutable$ListBuffer$$start$6.toStream__sci_Stream().flatMap__F1__scg_CanBuildFrom__O(new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(x$5$2) {
      var x$5 = $as_sc_TraversableOnce(x$5$2);
      return x$5.toStream__sci_Stream()
    })
  })(this)), ($m_sci_Stream$(), new $c_sci_Stream$StreamCanBuildFrom().init___())))
});
function $is_sci_Stream$StreamBuilder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Stream$StreamBuilder)))
}
function $as_sci_Stream$StreamBuilder(obj) {
  return (($is_sci_Stream$StreamBuilder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Stream$StreamBuilder"))
}
function $isArrayOf_sci_Stream$StreamBuilder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Stream$StreamBuilder)))
}
function $asArrayOf_sci_Stream$StreamBuilder(obj, depth) {
  return (($isArrayOf_sci_Stream$StreamBuilder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Stream$StreamBuilder;", depth))
}
var $d_sci_Stream$StreamBuilder = new $TypeData().initClass({
  sci_Stream$StreamBuilder: 0
}, false, "scala.collection.immutable.Stream$StreamBuilder", {
  sci_Stream$StreamBuilder: 1,
  scm_LazyBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1
});
$c_sci_Stream$StreamBuilder.prototype.$classData = $d_sci_Stream$StreamBuilder;
/** @constructor */
function $c_sci_StreamIterator() {
  $c_sc_AbstractIterator.call(this);
  this.these$2 = null
}
$c_sci_StreamIterator.prototype = new $h_sc_AbstractIterator();
$c_sci_StreamIterator.prototype.constructor = $c_sci_StreamIterator;
/** @constructor */
function $h_sci_StreamIterator() {
  /*<skip>*/
}
$h_sci_StreamIterator.prototype = $c_sci_StreamIterator.prototype;
$c_sci_StreamIterator.prototype.next__O = (function() {
  if ($s_sc_Iterator$class__isEmpty__sc_Iterator__Z(this)) {
    return $m_sc_Iterator$().empty$1.next__O()
  } else {
    var cur = this.these$2.v__sci_Stream();
    var result = cur.head__O();
    this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, cur$1) {
      return (function() {
        return $as_sci_Stream(cur$1.tail__O())
      })
    })(this, cur)));
    return result
  }
});
$c_sci_StreamIterator.prototype.init___sci_Stream = (function(self) {
  this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, self$1) {
    return (function() {
      return self$1
    })
  })(this, self)));
  return this
});
$c_sci_StreamIterator.prototype.hasNext__Z = (function() {
  var this$1 = this.these$2.v__sci_Stream();
  return $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)
});
$c_sci_StreamIterator.prototype.toStream__sci_Stream = (function() {
  var result = this.these$2.v__sci_Stream();
  this.these$2 = new $c_sci_StreamIterator$LazyCell().init___sci_StreamIterator__F0(this, new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      $m_sci_Stream$();
      return $m_sci_Stream$Empty$()
    })
  })(this)));
  return result
});
var $d_sci_StreamIterator = new $TypeData().initClass({
  sci_StreamIterator: 0
}, false, "scala.collection.immutable.StreamIterator", {
  sci_StreamIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_StreamIterator.prototype.$classData = $d_sci_StreamIterator;
/** @constructor */
function $c_sci_Traversable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_sci_Traversable$.prototype = new $h_scg_GenTraversableFactory();
$c_sci_Traversable$.prototype.constructor = $c_sci_Traversable$;
/** @constructor */
function $h_sci_Traversable$() {
  /*<skip>*/
}
$h_sci_Traversable$.prototype = $c_sci_Traversable$.prototype;
$c_sci_Traversable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sci_Traversable$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Traversable$ = new $TypeData().initClass({
  sci_Traversable$: 0
}, false, "scala.collection.immutable.Traversable$", {
  sci_Traversable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Traversable$.prototype.$classData = $d_sci_Traversable$;
var $n_sci_Traversable$ = (void 0);
function $m_sci_Traversable$() {
  if ((!$n_sci_Traversable$)) {
    $n_sci_Traversable$ = new $c_sci_Traversable$().init___()
  };
  return $n_sci_Traversable$
}
/** @constructor */
function $c_sci_TrieIterator() {
  $c_sc_AbstractIterator.call(this);
  this.elems$2 = null;
  this.scala$collection$immutable$TrieIterator$$depth$f = 0;
  this.scala$collection$immutable$TrieIterator$$arrayStack$f = null;
  this.scala$collection$immutable$TrieIterator$$posStack$f = null;
  this.scala$collection$immutable$TrieIterator$$arrayD$f = null;
  this.scala$collection$immutable$TrieIterator$$posD$f = 0;
  this.scala$collection$immutable$TrieIterator$$subIter$f = null
}
$c_sci_TrieIterator.prototype = new $h_sc_AbstractIterator();
$c_sci_TrieIterator.prototype.constructor = $c_sci_TrieIterator;
/** @constructor */
function $h_sci_TrieIterator() {
  /*<skip>*/
}
$h_sci_TrieIterator.prototype = $c_sci_TrieIterator.prototype;
$c_sci_TrieIterator.prototype.isContainer__p2__O__Z = (function(x) {
  return ($is_sci_HashMap$HashMap1(x) || $is_sci_HashSet$HashSet1(x))
});
$c_sci_TrieIterator.prototype.next__O = (function() {
  if ((this.scala$collection$immutable$TrieIterator$$subIter$f !== null)) {
    var el = this.scala$collection$immutable$TrieIterator$$subIter$f.next__O();
    if ((!this.scala$collection$immutable$TrieIterator$$subIter$f.hasNext__Z())) {
      this.scala$collection$immutable$TrieIterator$$subIter$f = null
    };
    return el
  } else {
    return this.next0__p2__Asci_Iterable__I__O(this.scala$collection$immutable$TrieIterator$$arrayD$f, this.scala$collection$immutable$TrieIterator$$posD$f)
  }
});
$c_sci_TrieIterator.prototype.initPosStack__AI = (function() {
  return $newArrayObject($d_I.getArrayOf(), [6])
});
$c_sci_TrieIterator.prototype.hasNext__Z = (function() {
  return ((this.scala$collection$immutable$TrieIterator$$subIter$f !== null) || (this.scala$collection$immutable$TrieIterator$$depth$f >= 0))
});
$c_sci_TrieIterator.prototype.next0__p2__Asci_Iterable__I__O = (function(elems, i) {
  _next0: while (true) {
    if ((i === (((-1) + elems.u.length) | 0))) {
      this.scala$collection$immutable$TrieIterator$$depth$f = (((-1) + this.scala$collection$immutable$TrieIterator$$depth$f) | 0);
      if ((this.scala$collection$immutable$TrieIterator$$depth$f >= 0)) {
        this.scala$collection$immutable$TrieIterator$$arrayD$f = this.scala$collection$immutable$TrieIterator$$arrayStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f];
        this.scala$collection$immutable$TrieIterator$$posD$f = this.scala$collection$immutable$TrieIterator$$posStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f];
        this.scala$collection$immutable$TrieIterator$$arrayStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f] = null
      } else {
        this.scala$collection$immutable$TrieIterator$$arrayD$f = null;
        this.scala$collection$immutable$TrieIterator$$posD$f = 0
      }
    } else {
      this.scala$collection$immutable$TrieIterator$$posD$f = ((1 + this.scala$collection$immutable$TrieIterator$$posD$f) | 0)
    };
    var m = elems.u[i];
    if (this.isContainer__p2__O__Z(m)) {
      return $as_sci_HashSet$HashSet1(m).key$6
    } else if (this.isTrie__p2__O__Z(m)) {
      if ((this.scala$collection$immutable$TrieIterator$$depth$f >= 0)) {
        this.scala$collection$immutable$TrieIterator$$arrayStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f] = this.scala$collection$immutable$TrieIterator$$arrayD$f;
        this.scala$collection$immutable$TrieIterator$$posStack$f.u[this.scala$collection$immutable$TrieIterator$$depth$f] = this.scala$collection$immutable$TrieIterator$$posD$f
      };
      this.scala$collection$immutable$TrieIterator$$depth$f = ((1 + this.scala$collection$immutable$TrieIterator$$depth$f) | 0);
      this.scala$collection$immutable$TrieIterator$$arrayD$f = this.getElems__p2__sci_Iterable__Asci_Iterable(m);
      this.scala$collection$immutable$TrieIterator$$posD$f = 0;
      var temp$elems = this.getElems__p2__sci_Iterable__Asci_Iterable(m);
      elems = temp$elems;
      i = 0;
      continue _next0
    } else {
      this.scala$collection$immutable$TrieIterator$$subIter$f = m.iterator__sc_Iterator();
      return this.next__O()
    }
  }
});
$c_sci_TrieIterator.prototype.getElems__p2__sci_Iterable__Asci_Iterable = (function(x) {
  if ($is_sci_HashMap$HashTrieMap(x)) {
    var x2 = $as_sci_HashMap$HashTrieMap(x);
    var jsx$1 = $asArrayOf_sc_AbstractIterable(x2.elems__Asci_HashMap(), 1)
  } else {
    if ((!$is_sci_HashSet$HashTrieSet(x))) {
      throw new $c_s_MatchError().init___O(x)
    };
    var x3 = $as_sci_HashSet$HashTrieSet(x);
    var jsx$1 = x3.elems$5
  };
  return $asArrayOf_sci_Iterable(jsx$1, 1)
});
$c_sci_TrieIterator.prototype.init___Asci_Iterable = (function(elems) {
  this.elems$2 = elems;
  this.scala$collection$immutable$TrieIterator$$depth$f = 0;
  this.scala$collection$immutable$TrieIterator$$arrayStack$f = this.initArrayStack__AAsci_Iterable();
  this.scala$collection$immutable$TrieIterator$$posStack$f = this.initPosStack__AI();
  this.scala$collection$immutable$TrieIterator$$arrayD$f = this.elems$2;
  this.scala$collection$immutable$TrieIterator$$posD$f = 0;
  this.scala$collection$immutable$TrieIterator$$subIter$f = null;
  return this
});
$c_sci_TrieIterator.prototype.isTrie__p2__O__Z = (function(x) {
  return ($is_sci_HashMap$HashTrieMap(x) || $is_sci_HashSet$HashTrieSet(x))
});
$c_sci_TrieIterator.prototype.initArrayStack__AAsci_Iterable = (function() {
  return $newArrayObject($d_sci_Iterable.getArrayOf().getArrayOf(), [6])
});
/** @constructor */
function $c_sci_VectorBuilder() {
  $c_O.call(this);
  this.blockIndex$1 = 0;
  this.lo$1 = 0;
  this.depth$1 = 0;
  this.display0$1 = null;
  this.display1$1 = null;
  this.display2$1 = null;
  this.display3$1 = null;
  this.display4$1 = null;
  this.display5$1 = null
}
$c_sci_VectorBuilder.prototype = new $h_O();
$c_sci_VectorBuilder.prototype.constructor = $c_sci_VectorBuilder;
/** @constructor */
function $h_sci_VectorBuilder() {
  /*<skip>*/
}
$h_sci_VectorBuilder.prototype = $c_sci_VectorBuilder.prototype;
$c_sci_VectorBuilder.prototype.display3__AO = (function() {
  return this.display3$1
});
$c_sci_VectorBuilder.prototype.init___ = (function() {
  this.display0$1 = $newArrayObject($d_O.getArrayOf(), [32]);
  this.depth$1 = 1;
  this.blockIndex$1 = 0;
  this.lo$1 = 0;
  return this
});
$c_sci_VectorBuilder.prototype.depth__I = (function() {
  return this.depth$1
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__sci_VectorBuilder(elem)
});
$c_sci_VectorBuilder.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$1 = x$1
});
$c_sci_VectorBuilder.prototype.display0__AO = (function() {
  return this.display0$1
});
$c_sci_VectorBuilder.prototype.display4__AO = (function() {
  return this.display4$1
});
$c_sci_VectorBuilder.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$1 = x$1
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__sci_VectorBuilder = (function(elem) {
  if ((this.lo$1 >= this.display0$1.u.length)) {
    var newBlockIndex = ((32 + this.blockIndex$1) | 0);
    var xor = (this.blockIndex$1 ^ newBlockIndex);
    $s_sci_VectorPointer$class__gotoNextBlockStartWritable__sci_VectorPointer__I__I__V(this, newBlockIndex, xor);
    this.blockIndex$1 = newBlockIndex;
    this.lo$1 = 0
  };
  this.display0$1.u[this.lo$1] = elem;
  this.lo$1 = ((1 + this.lo$1) | 0);
  return this
});
$c_sci_VectorBuilder.prototype.result__O = (function() {
  return this.result__sci_Vector()
});
$c_sci_VectorBuilder.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$1 = x$1
});
$c_sci_VectorBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sci_VectorBuilder.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$1 = x$1
});
$c_sci_VectorBuilder.prototype.display1__AO = (function() {
  return this.display1$1
});
$c_sci_VectorBuilder.prototype.display5__AO = (function() {
  return this.display5$1
});
$c_sci_VectorBuilder.prototype.result__sci_Vector = (function() {
  var size = ((this.blockIndex$1 + this.lo$1) | 0);
  if ((size === 0)) {
    var this$1 = $m_sci_Vector$();
    return this$1.NIL$6
  };
  var s = new $c_sci_Vector().init___I__I__I(0, size, 0);
  var depth = this.depth$1;
  $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s, this, depth);
  if ((this.depth$1 > 1)) {
    var xor = (((-1) + size) | 0);
    $s_sci_VectorPointer$class__gotoPos__sci_VectorPointer__I__I__V(s, 0, xor)
  };
  return s
});
$c_sci_VectorBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__sci_VectorBuilder(elem)
});
$c_sci_VectorBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sci_VectorBuilder.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$1 = x$1
});
$c_sci_VectorBuilder.prototype.display2__AO = (function() {
  return this.display2$1
});
$c_sci_VectorBuilder.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$1 = x$1
});
$c_sci_VectorBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $as_sci_VectorBuilder($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs))
});
$c_sci_VectorBuilder.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$1 = x$1
});
function $is_sci_VectorBuilder(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_VectorBuilder)))
}
function $as_sci_VectorBuilder(obj) {
  return (($is_sci_VectorBuilder(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.VectorBuilder"))
}
function $isArrayOf_sci_VectorBuilder(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_VectorBuilder)))
}
function $asArrayOf_sci_VectorBuilder(obj, depth) {
  return (($isArrayOf_sci_VectorBuilder(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.VectorBuilder;", depth))
}
var $d_sci_VectorBuilder = new $TypeData().initClass({
  sci_VectorBuilder: 0
}, false, "scala.collection.immutable.VectorBuilder", {
  sci_VectorBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  sci_VectorPointer: 1
});
$c_sci_VectorBuilder.prototype.$classData = $d_sci_VectorBuilder;
/** @constructor */
function $c_scm_Builder$$anon$1() {
  $c_O.call(this);
  this.self$1 = null;
  this.f$1$1 = null
}
$c_scm_Builder$$anon$1.prototype = new $h_O();
$c_scm_Builder$$anon$1.prototype.constructor = $c_scm_Builder$$anon$1;
/** @constructor */
function $h_scm_Builder$$anon$1() {
  /*<skip>*/
}
$h_scm_Builder$$anon$1.prototype = $c_scm_Builder$$anon$1.prototype;
$c_scm_Builder$$anon$1.prototype.init___scm_Builder__F1 = (function($$outer, f$1) {
  this.f$1$1 = f$1;
  this.self$1 = $$outer;
  return this
});
$c_scm_Builder$$anon$1.prototype.equals__O__Z = (function(that) {
  return $s_s_Proxy$class__equals__s_Proxy__O__Z(this, that)
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_Builder$$anon$1(elem)
});
$c_scm_Builder$$anon$1.prototype.toString__T = (function() {
  return $s_s_Proxy$class__toString__s_Proxy__T(this)
});
$c_scm_Builder$$anon$1.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_Builder$$anon$1 = (function(xs) {
  this.self$1.$$plus$plus$eq__sc_TraversableOnce__scg_Growable(xs);
  return this
});
$c_scm_Builder$$anon$1.prototype.result__O = (function() {
  return this.f$1$1.apply__O__O(this.self$1.result__O())
});
$c_scm_Builder$$anon$1.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundColl) {
  this.self$1.sizeHintBounded__I__sc_TraversableLike__V(size, boundColl)
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_Builder$$anon$1(elem)
});
$c_scm_Builder$$anon$1.prototype.$$plus$eq__O__scm_Builder$$anon$1 = (function(x) {
  this.self$1.$$plus$eq__O__scm_Builder(x);
  return this
});
$c_scm_Builder$$anon$1.prototype.hashCode__I = (function() {
  return this.self$1.hashCode__I()
});
$c_scm_Builder$$anon$1.prototype.sizeHint__I__V = (function(size) {
  this.self$1.sizeHint__I__V(size)
});
$c_scm_Builder$$anon$1.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_Builder$$anon$1(xs)
});
var $d_scm_Builder$$anon$1 = new $TypeData().initClass({
  scm_Builder$$anon$1: 0
}, false, "scala.collection.mutable.Builder$$anon$1", {
  scm_Builder$$anon$1: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Proxy: 1
});
$c_scm_Builder$$anon$1.prototype.$classData = $d_scm_Builder$$anon$1;
/** @constructor */
function $c_scm_FlatHashTable$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.i$2 = 0;
  this.$$outer$2 = null
}
$c_scm_FlatHashTable$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_scm_FlatHashTable$$anon$1.prototype.constructor = $c_scm_FlatHashTable$$anon$1;
/** @constructor */
function $h_scm_FlatHashTable$$anon$1() {
  /*<skip>*/
}
$h_scm_FlatHashTable$$anon$1.prototype = $c_scm_FlatHashTable$$anon$1.prototype;
$c_scm_FlatHashTable$$anon$1.prototype.next__O = (function() {
  if (this.hasNext__Z()) {
    this.i$2 = ((1 + this.i$2) | 0);
    var this$1 = this.$$outer$2;
    var entry = this.$$outer$2.table$5.u[(((-1) + this.i$2) | 0)];
    return $s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O(this$1, entry)
  } else {
    return $m_sc_Iterator$().empty$1.next__O()
  }
});
$c_scm_FlatHashTable$$anon$1.prototype.init___scm_FlatHashTable = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$2 = $$outer
  };
  this.i$2 = 0;
  return this
});
$c_scm_FlatHashTable$$anon$1.prototype.hasNext__Z = (function() {
  while (((this.i$2 < this.$$outer$2.table$5.u.length) && (this.$$outer$2.table$5.u[this.i$2] === null))) {
    this.i$2 = ((1 + this.i$2) | 0)
  };
  return (this.i$2 < this.$$outer$2.table$5.u.length)
});
var $d_scm_FlatHashTable$$anon$1 = new $TypeData().initClass({
  scm_FlatHashTable$$anon$1: 0
}, false, "scala.collection.mutable.FlatHashTable$$anon$1", {
  scm_FlatHashTable$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_scm_FlatHashTable$$anon$1.prototype.$classData = $d_scm_FlatHashTable$$anon$1;
/** @constructor */
function $c_scm_HashTable$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.iterTable$2 = null;
  this.idx$2 = 0;
  this.es$2 = null
}
$c_scm_HashTable$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_scm_HashTable$$anon$1.prototype.constructor = $c_scm_HashTable$$anon$1;
/** @constructor */
function $h_scm_HashTable$$anon$1() {
  /*<skip>*/
}
$h_scm_HashTable$$anon$1.prototype = $c_scm_HashTable$$anon$1.prototype;
$c_scm_HashTable$$anon$1.prototype.init___scm_HashTable = (function($$outer) {
  this.iterTable$2 = $$outer.table$5;
  this.idx$2 = $s_scm_HashTable$class__scala$collection$mutable$HashTable$$lastPopulatedIndex__scm_HashTable__I($$outer);
  this.es$2 = this.iterTable$2.u[this.idx$2];
  return this
});
$c_scm_HashTable$$anon$1.prototype.next__O = (function() {
  return this.next__scm_HashEntry()
});
$c_scm_HashTable$$anon$1.prototype.next__scm_HashEntry = (function() {
  var res = this.es$2;
  this.es$2 = $as_scm_HashEntry(this.es$2.next$1);
  while (((this.es$2 === null) && (this.idx$2 > 0))) {
    this.idx$2 = (((-1) + this.idx$2) | 0);
    this.es$2 = this.iterTable$2.u[this.idx$2]
  };
  return res
});
$c_scm_HashTable$$anon$1.prototype.hasNext__Z = (function() {
  return (this.es$2 !== null)
});
var $d_scm_HashTable$$anon$1 = new $TypeData().initClass({
  scm_HashTable$$anon$1: 0
}, false, "scala.collection.mutable.HashTable$$anon$1", {
  scm_HashTable$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_scm_HashTable$$anon$1.prototype.$classData = $d_scm_HashTable$$anon$1;
/** @constructor */
function $c_scm_Iterable$() {
  $c_scg_GenTraversableFactory.call(this)
}
$c_scm_Iterable$.prototype = new $h_scg_GenTraversableFactory();
$c_scm_Iterable$.prototype.constructor = $c_scm_Iterable$;
/** @constructor */
function $h_scm_Iterable$() {
  /*<skip>*/
}
$h_scm_Iterable$.prototype = $c_scm_Iterable$.prototype;
$c_scm_Iterable$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_scm_Iterable$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ArrayBuffer().init___()
});
var $d_scm_Iterable$ = new $TypeData().initClass({
  scm_Iterable$: 0
}, false, "scala.collection.mutable.Iterable$", {
  scm_Iterable$: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_scm_Iterable$.prototype.$classData = $d_scm_Iterable$;
var $n_scm_Iterable$ = (void 0);
function $m_scm_Iterable$() {
  if ((!$n_scm_Iterable$)) {
    $n_scm_Iterable$ = new $c_scm_Iterable$().init___()
  };
  return $n_scm_Iterable$
}
/** @constructor */
function $c_scm_ListBuffer$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.cursor$2 = null
}
$c_scm_ListBuffer$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_scm_ListBuffer$$anon$1.prototype.constructor = $c_scm_ListBuffer$$anon$1;
/** @constructor */
function $h_scm_ListBuffer$$anon$1() {
  /*<skip>*/
}
$h_scm_ListBuffer$$anon$1.prototype = $c_scm_ListBuffer$$anon$1.prototype;
$c_scm_ListBuffer$$anon$1.prototype.init___scm_ListBuffer = (function($$outer) {
  this.cursor$2 = ($$outer.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z() ? $m_sci_Nil$() : $$outer.scala$collection$mutable$ListBuffer$$start$6);
  return this
});
$c_scm_ListBuffer$$anon$1.prototype.next__O = (function() {
  if ((!this.hasNext__Z())) {
    throw new $c_ju_NoSuchElementException().init___T("next on empty Iterator")
  } else {
    var ans = this.cursor$2.head__O();
    this.cursor$2 = $as_sci_List(this.cursor$2.tail__O());
    return ans
  }
});
$c_scm_ListBuffer$$anon$1.prototype.hasNext__Z = (function() {
  return (this.cursor$2 !== $m_sci_Nil$())
});
var $d_scm_ListBuffer$$anon$1 = new $TypeData().initClass({
  scm_ListBuffer$$anon$1: 0
}, false, "scala.collection.mutable.ListBuffer$$anon$1", {
  scm_ListBuffer$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_scm_ListBuffer$$anon$1.prototype.$classData = $d_scm_ListBuffer$$anon$1;
/** @constructor */
function $c_sr_NonLocalReturnControl() {
  $c_jl_Throwable.call(this);
  this.key$2 = null;
  this.value$f = null
}
$c_sr_NonLocalReturnControl.prototype = new $h_jl_Throwable();
$c_sr_NonLocalReturnControl.prototype.constructor = $c_sr_NonLocalReturnControl;
/** @constructor */
function $h_sr_NonLocalReturnControl() {
  /*<skip>*/
}
$h_sr_NonLocalReturnControl.prototype = $c_sr_NonLocalReturnControl.prototype;
$c_sr_NonLocalReturnControl.prototype.fillInStackTrace__jl_Throwable = (function() {
  return this
});
$c_sr_NonLocalReturnControl.prototype.init___O__O = (function(key, value) {
  this.key$2 = key;
  this.value$f = value;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
function $is_sr_NonLocalReturnControl(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sr_NonLocalReturnControl)))
}
function $as_sr_NonLocalReturnControl(obj) {
  return (($is_sr_NonLocalReturnControl(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.runtime.NonLocalReturnControl"))
}
function $isArrayOf_sr_NonLocalReturnControl(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sr_NonLocalReturnControl)))
}
function $asArrayOf_sr_NonLocalReturnControl(obj, depth) {
  return (($isArrayOf_sr_NonLocalReturnControl(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.runtime.NonLocalReturnControl;", depth))
}
/** @constructor */
function $c_sr_ScalaRunTime$$anon$1() {
  $c_sc_AbstractIterator.call(this);
  this.c$2 = 0;
  this.cmax$2 = 0;
  this.x$2$2 = null
}
$c_sr_ScalaRunTime$$anon$1.prototype = new $h_sc_AbstractIterator();
$c_sr_ScalaRunTime$$anon$1.prototype.constructor = $c_sr_ScalaRunTime$$anon$1;
/** @constructor */
function $h_sr_ScalaRunTime$$anon$1() {
  /*<skip>*/
}
$h_sr_ScalaRunTime$$anon$1.prototype = $c_sr_ScalaRunTime$$anon$1.prototype;
$c_sr_ScalaRunTime$$anon$1.prototype.next__O = (function() {
  var result = this.x$2$2.productElement__I__O(this.c$2);
  this.c$2 = ((1 + this.c$2) | 0);
  return result
});
$c_sr_ScalaRunTime$$anon$1.prototype.init___s_Product = (function(x$2) {
  this.x$2$2 = x$2;
  this.c$2 = 0;
  this.cmax$2 = x$2.productArity__I();
  return this
});
$c_sr_ScalaRunTime$$anon$1.prototype.hasNext__Z = (function() {
  return (this.c$2 < this.cmax$2)
});
var $d_sr_ScalaRunTime$$anon$1 = new $TypeData().initClass({
  sr_ScalaRunTime$$anon$1: 0
}, false, "scala.runtime.ScalaRunTime$$anon$1", {
  sr_ScalaRunTime$$anon$1: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sr_ScalaRunTime$$anon$1.prototype.$classData = $d_sr_ScalaRunTime$$anon$1;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_BoundsComponent() {
  $c_O.call(this);
  this.radius$1 = 0.0
}
$c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_BoundsComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_BoundsComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype = $c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype.productPrefix__T = (function() {
  return "BoundsComponent"
});
$c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype.productArity__I = (function() {
  return 1
});
$c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_BoundsComponent(x$1)) {
    var BoundsComponent$1 = $as_Lcom_darkoverlordofdata_demo_BoundsComponent(x$1);
    return (this.radius$1 === BoundsComponent$1.radius$1)
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.radius$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype.init___F = (function(radius) {
  this.radius$1 = radius;
  return this
});
$c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  var jsx$2 = $m_sr_Statics$();
  var jsx$1 = acc;
  var this$1 = $m_sr_Statics$();
  var fv = this.radius$1;
  acc = jsx$2.mix__I__I__I(jsx$1, this$1.doubleHash__D__I(fv));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lcom_darkoverlordofdata_demo_BoundsComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_BoundsComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_BoundsComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_BoundsComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.BoundsComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_BoundsComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_BoundsComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_BoundsComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_BoundsComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.BoundsComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_BoundsComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_BoundsComponent: 0
}, false, "com.darkoverlordofdata.demo.BoundsComponent", {
  Lcom_darkoverlordofdata_demo_BoundsComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_BoundsComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_BoundsComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_BulletComponent() {
  $c_O.call(this);
  this.active$1 = false
}
$c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_BulletComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_BulletComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_BulletComponent.prototype = $c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype.productPrefix__T = (function() {
  return "BulletComponent"
});
$c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype.productArity__I = (function() {
  return 1
});
$c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_BulletComponent(x$1)) {
    var BulletComponent$1 = $as_Lcom_darkoverlordofdata_demo_BulletComponent(x$1);
    return (this.active$1 === BulletComponent$1.active$1)
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.active$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, (this.active$1 ? 1231 : 1237));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype.init___Z = (function(active) {
  this.active$1 = active;
  return this
});
function $is_Lcom_darkoverlordofdata_demo_BulletComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_BulletComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_BulletComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_BulletComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.BulletComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_BulletComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_BulletComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_BulletComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_BulletComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.BulletComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_BulletComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_BulletComponent: 0
}, false, "com.darkoverlordofdata.demo.BulletComponent", {
  Lcom_darkoverlordofdata_demo_BulletComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_BulletComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_BulletComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_DestroyComponent() {
  $c_O.call(this);
  this.active$1 = false
}
$c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_DestroyComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_DestroyComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype = $c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype.productPrefix__T = (function() {
  return "DestroyComponent"
});
$c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype.productArity__I = (function() {
  return 1
});
$c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_DestroyComponent(x$1)) {
    var DestroyComponent$1 = $as_Lcom_darkoverlordofdata_demo_DestroyComponent(x$1);
    return (this.active$1 === DestroyComponent$1.active$1)
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.active$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, (this.active$1 ? 1231 : 1237));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype.init___Z = (function(active) {
  this.active$1 = active;
  return this
});
function $is_Lcom_darkoverlordofdata_demo_DestroyComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_DestroyComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_DestroyComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_DestroyComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.DestroyComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_DestroyComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_DestroyComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_DestroyComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_DestroyComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.DestroyComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_DestroyComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_DestroyComponent: 0
}, false, "com.darkoverlordofdata.demo.DestroyComponent", {
  Lcom_darkoverlordofdata_demo_DestroyComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_DestroyComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_DestroyComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_EnemyComponent() {
  $c_O.call(this);
  this.active$1 = false
}
$c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_EnemyComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_EnemyComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype = $c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype.productPrefix__T = (function() {
  return "EnemyComponent"
});
$c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype.productArity__I = (function() {
  return 1
});
$c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_EnemyComponent(x$1)) {
    var EnemyComponent$1 = $as_Lcom_darkoverlordofdata_demo_EnemyComponent(x$1);
    return (this.active$1 === EnemyComponent$1.active$1)
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.active$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, (this.active$1 ? 1231 : 1237));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype.init___Z = (function(active) {
  this.active$1 = active;
  return this
});
function $is_Lcom_darkoverlordofdata_demo_EnemyComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_EnemyComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_EnemyComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_EnemyComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.EnemyComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_EnemyComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_EnemyComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_EnemyComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_EnemyComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.EnemyComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_EnemyComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_EnemyComponent: 0
}, false, "com.darkoverlordofdata.demo.EnemyComponent", {
  Lcom_darkoverlordofdata_demo_EnemyComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_EnemyComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_EnemyComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_ExpiresComponent() {
  $c_O.call(this);
  this.delay$1 = 0.0
}
$c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_ExpiresComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_ExpiresComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype = $c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype.productPrefix__T = (function() {
  return "ExpiresComponent"
});
$c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype.productArity__I = (function() {
  return 1
});
$c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_ExpiresComponent(x$1)) {
    var ExpiresComponent$1 = $as_Lcom_darkoverlordofdata_demo_ExpiresComponent(x$1);
    return (this.delay$1 === ExpiresComponent$1.delay$1)
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.delay$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype.init___F = (function(delay) {
  this.delay$1 = delay;
  return this
});
$c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  var jsx$2 = $m_sr_Statics$();
  var jsx$1 = acc;
  var this$1 = $m_sr_Statics$();
  var fv = this.delay$1;
  acc = jsx$2.mix__I__I__I(jsx$1, this$1.doubleHash__D__I(fv));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lcom_darkoverlordofdata_demo_ExpiresComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_ExpiresComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_ExpiresComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_ExpiresComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.ExpiresComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_ExpiresComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_ExpiresComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_ExpiresComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_ExpiresComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.ExpiresComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_ExpiresComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_ExpiresComponent: 0
}, false, "com.darkoverlordofdata.demo.ExpiresComponent", {
  Lcom_darkoverlordofdata_demo_ExpiresComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_ExpiresComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_ExpiresComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_FiringComponent() {
  $c_O.call(this);
  this.active$1 = false
}
$c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_FiringComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_FiringComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_FiringComponent.prototype = $c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype.productPrefix__T = (function() {
  return "FiringComponent"
});
$c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype.productArity__I = (function() {
  return 1
});
$c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_FiringComponent(x$1)) {
    var FiringComponent$1 = $as_Lcom_darkoverlordofdata_demo_FiringComponent(x$1);
    return (this.active$1 === FiringComponent$1.active$1)
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.active$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, (this.active$1 ? 1231 : 1237));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype.init___Z = (function(active) {
  this.active$1 = active;
  return this
});
function $is_Lcom_darkoverlordofdata_demo_FiringComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_FiringComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_FiringComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_FiringComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.FiringComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_FiringComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_FiringComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_FiringComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_FiringComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.FiringComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_FiringComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_FiringComponent: 0
}, false, "com.darkoverlordofdata.demo.FiringComponent", {
  Lcom_darkoverlordofdata_demo_FiringComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_FiringComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_FiringComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_HealthComponent() {
  $c_O.call(this);
  this.currentHealth$1 = 0.0;
  this.maximumHealth$1 = 0.0
}
$c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_HealthComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_HealthComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_HealthComponent.prototype = $c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype.productPrefix__T = (function() {
  return "HealthComponent"
});
$c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype.productArity__I = (function() {
  return 2
});
$c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_HealthComponent(x$1)) {
    var HealthComponent$1 = $as_Lcom_darkoverlordofdata_demo_HealthComponent(x$1);
    return ((this.currentHealth$1 === HealthComponent$1.currentHealth$1) && (this.maximumHealth$1 === HealthComponent$1.maximumHealth$1))
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.currentHealth$1;
      break
    }
    case 1: {
      return this.maximumHealth$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype.init___F__F = (function(currentHealth, maximumHealth) {
  this.currentHealth$1 = currentHealth;
  this.maximumHealth$1 = maximumHealth;
  return this
});
$c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  var jsx$2 = $m_sr_Statics$();
  var jsx$1 = acc;
  var this$1 = $m_sr_Statics$();
  var fv = this.currentHealth$1;
  acc = jsx$2.mix__I__I__I(jsx$1, this$1.doubleHash__D__I(fv));
  var jsx$4 = $m_sr_Statics$();
  var jsx$3 = acc;
  var this$2 = $m_sr_Statics$();
  var fv$1 = this.maximumHealth$1;
  acc = jsx$4.mix__I__I__I(jsx$3, this$2.doubleHash__D__I(fv$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 2)
});
$c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lcom_darkoverlordofdata_demo_HealthComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_HealthComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_HealthComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_HealthComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.HealthComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_HealthComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_HealthComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_HealthComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_HealthComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.HealthComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_HealthComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_HealthComponent: 0
}, false, "com.darkoverlordofdata.demo.HealthComponent", {
  Lcom_darkoverlordofdata_demo_HealthComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_HealthComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_HealthComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_LayerComponent() {
  $c_O.call(this);
  this.ordinal$1 = 0
}
$c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_LayerComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_LayerComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_LayerComponent.prototype = $c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype.productPrefix__T = (function() {
  return "LayerComponent"
});
$c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype.productArity__I = (function() {
  return 1
});
$c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_LayerComponent(x$1)) {
    var LayerComponent$1 = $as_Lcom_darkoverlordofdata_demo_LayerComponent(x$1);
    return (this.ordinal$1 === LayerComponent$1.ordinal$1)
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.ordinal$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype.init___I = (function(ordinal) {
  this.ordinal$1 = ordinal;
  return this
});
$c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.ordinal$1);
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lcom_darkoverlordofdata_demo_LayerComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_LayerComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_LayerComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_LayerComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.LayerComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_LayerComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_LayerComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_LayerComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_LayerComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.LayerComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_LayerComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_LayerComponent: 0
}, false, "com.darkoverlordofdata.demo.LayerComponent", {
  Lcom_darkoverlordofdata_demo_LayerComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_LayerComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_LayerComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_PlayerComponent() {
  $c_O.call(this);
  this.active$1 = false
}
$c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_PlayerComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_PlayerComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype = $c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype.productPrefix__T = (function() {
  return "PlayerComponent"
});
$c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype.productArity__I = (function() {
  return 1
});
$c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_PlayerComponent(x$1)) {
    var PlayerComponent$1 = $as_Lcom_darkoverlordofdata_demo_PlayerComponent(x$1);
    return (this.active$1 === PlayerComponent$1.active$1)
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.active$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, (this.active$1 ? 1231 : 1237));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype.init___Z = (function(active) {
  this.active$1 = active;
  return this
});
function $is_Lcom_darkoverlordofdata_demo_PlayerComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_PlayerComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_PlayerComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_PlayerComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.PlayerComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_PlayerComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_PlayerComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_PlayerComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_PlayerComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.PlayerComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_PlayerComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_PlayerComponent: 0
}, false, "com.darkoverlordofdata.demo.PlayerComponent", {
  Lcom_darkoverlordofdata_demo_PlayerComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_PlayerComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_PlayerComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_PositionComponent() {
  $c_O.call(this);
  this.x$1 = 0.0;
  this.y$1 = 0.0
}
$c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_PositionComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_PositionComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_PositionComponent.prototype = $c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype.productPrefix__T = (function() {
  return "PositionComponent"
});
$c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype.productArity__I = (function() {
  return 2
});
$c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_PositionComponent(x$1)) {
    var PositionComponent$1 = $as_Lcom_darkoverlordofdata_demo_PositionComponent(x$1);
    return ((this.x$1 === PositionComponent$1.x$1) && (this.y$1 === PositionComponent$1.y$1))
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.x$1;
      break
    }
    case 1: {
      return this.y$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype.init___F__F = (function(x, y) {
  this.x$1 = x;
  this.y$1 = y;
  return this
});
$c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  var jsx$2 = $m_sr_Statics$();
  var jsx$1 = acc;
  var this$1 = $m_sr_Statics$();
  var fv = this.x$1;
  acc = jsx$2.mix__I__I__I(jsx$1, this$1.doubleHash__D__I(fv));
  var jsx$4 = $m_sr_Statics$();
  var jsx$3 = acc;
  var this$2 = $m_sr_Statics$();
  var fv$1 = this.y$1;
  acc = jsx$4.mix__I__I__I(jsx$3, this$2.doubleHash__D__I(fv$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 2)
});
$c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lcom_darkoverlordofdata_demo_PositionComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_PositionComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_PositionComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_PositionComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.PositionComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_PositionComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_PositionComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_PositionComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_PositionComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.PositionComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_PositionComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_PositionComponent: 0
}, false, "com.darkoverlordofdata.demo.PositionComponent", {
  Lcom_darkoverlordofdata_demo_PositionComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_PositionComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_PositionComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_ScaleComponent() {
  $c_O.call(this);
  this.x$1 = 0.0;
  this.y$1 = 0.0
}
$c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_ScaleComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_ScaleComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype = $c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype.productPrefix__T = (function() {
  return "ScaleComponent"
});
$c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype.productArity__I = (function() {
  return 2
});
$c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_ScaleComponent(x$1)) {
    var ScaleComponent$1 = $as_Lcom_darkoverlordofdata_demo_ScaleComponent(x$1);
    return ((this.x$1 === ScaleComponent$1.x$1) && (this.y$1 === ScaleComponent$1.y$1))
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.x$1;
      break
    }
    case 1: {
      return this.y$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype.init___F__F = (function(x, y) {
  this.x$1 = x;
  this.y$1 = y;
  return this
});
$c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  var jsx$2 = $m_sr_Statics$();
  var jsx$1 = acc;
  var this$1 = $m_sr_Statics$();
  var fv = this.x$1;
  acc = jsx$2.mix__I__I__I(jsx$1, this$1.doubleHash__D__I(fv));
  var jsx$4 = $m_sr_Statics$();
  var jsx$3 = acc;
  var this$2 = $m_sr_Statics$();
  var fv$1 = this.y$1;
  acc = jsx$4.mix__I__I__I(jsx$3, this$2.doubleHash__D__I(fv$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 2)
});
$c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lcom_darkoverlordofdata_demo_ScaleComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_ScaleComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_ScaleComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_ScaleComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.ScaleComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_ScaleComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_ScaleComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_ScaleComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_ScaleComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.ScaleComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_ScaleComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_ScaleComponent: 0
}, false, "com.darkoverlordofdata.demo.ScaleComponent", {
  Lcom_darkoverlordofdata_demo_ScaleComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_ScaleComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_ScaleComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_ScoreComponent() {
  $c_O.call(this);
  this.value$1 = 0
}
$c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_ScoreComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_ScoreComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype = $c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype.productPrefix__T = (function() {
  return "ScoreComponent"
});
$c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype.productArity__I = (function() {
  return 1
});
$c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_ScoreComponent(x$1)) {
    var ScoreComponent$1 = $as_Lcom_darkoverlordofdata_demo_ScoreComponent(x$1);
    return (this.value$1 === ScoreComponent$1.value$1)
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.value$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype.init___I = (function(value) {
  this.value$1 = value;
  return this
});
$c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.value$1);
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lcom_darkoverlordofdata_demo_ScoreComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_ScoreComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_ScoreComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_ScoreComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.ScoreComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_ScoreComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_ScoreComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_ScoreComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_ScoreComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.ScoreComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_ScoreComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_ScoreComponent: 0
}, false, "com.darkoverlordofdata.demo.ScoreComponent", {
  Lcom_darkoverlordofdata_demo_ScoreComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_ScoreComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_ScoreComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_SoundEffectComponent() {
  $c_O.call(this);
  this.effect$1 = 0
}
$c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_SoundEffectComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_SoundEffectComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype = $c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype.productPrefix__T = (function() {
  return "SoundEffectComponent"
});
$c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype.productArity__I = (function() {
  return 1
});
$c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_SoundEffectComponent(x$1)) {
    var SoundEffectComponent$1 = $as_Lcom_darkoverlordofdata_demo_SoundEffectComponent(x$1);
    return (this.effect$1 === SoundEffectComponent$1.effect$1)
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.effect$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype.init___I = (function(effect) {
  this.effect$1 = effect;
  return this
});
$c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  acc = $m_sr_Statics$().mix__I__I__I(acc, this.effect$1);
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 1)
});
$c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lcom_darkoverlordofdata_demo_SoundEffectComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_SoundEffectComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_SoundEffectComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_SoundEffectComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.SoundEffectComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_SoundEffectComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_SoundEffectComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_SoundEffectComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_SoundEffectComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.SoundEffectComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_SoundEffectComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_SoundEffectComponent: 0
}, false, "com.darkoverlordofdata.demo.SoundEffectComponent", {
  Lcom_darkoverlordofdata_demo_SoundEffectComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_SoundEffectComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_SoundEffectComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_TintComponent() {
  $c_O.call(this);
  this.r$1 = 0.0;
  this.g$1 = 0.0;
  this.b$1 = 0.0;
  this.a$1 = 0.0
}
$c_Lcom_darkoverlordofdata_demo_TintComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_TintComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_TintComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_TintComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_TintComponent.prototype = $c_Lcom_darkoverlordofdata_demo_TintComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_TintComponent.prototype.productPrefix__T = (function() {
  return "TintComponent"
});
$c_Lcom_darkoverlordofdata_demo_TintComponent.prototype.productArity__I = (function() {
  return 4
});
$c_Lcom_darkoverlordofdata_demo_TintComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_TintComponent(x$1)) {
    var TintComponent$1 = $as_Lcom_darkoverlordofdata_demo_TintComponent(x$1);
    return ((((this.r$1 === TintComponent$1.r$1) && (this.g$1 === TintComponent$1.g$1)) && (this.b$1 === TintComponent$1.b$1)) && (this.a$1 === TintComponent$1.a$1))
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_TintComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.r$1;
      break
    }
    case 1: {
      return this.g$1;
      break
    }
    case 2: {
      return this.b$1;
      break
    }
    case 3: {
      return this.a$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_TintComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_TintComponent.prototype.init___F__F__F__F = (function(r, g, b, a) {
  this.r$1 = r;
  this.g$1 = g;
  this.b$1 = b;
  this.a$1 = a;
  return this
});
$c_Lcom_darkoverlordofdata_demo_TintComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  var jsx$2 = $m_sr_Statics$();
  var jsx$1 = acc;
  var this$1 = $m_sr_Statics$();
  var fv = this.r$1;
  acc = jsx$2.mix__I__I__I(jsx$1, this$1.doubleHash__D__I(fv));
  var jsx$4 = $m_sr_Statics$();
  var jsx$3 = acc;
  var this$2 = $m_sr_Statics$();
  var fv$1 = this.g$1;
  acc = jsx$4.mix__I__I__I(jsx$3, this$2.doubleHash__D__I(fv$1));
  var jsx$6 = $m_sr_Statics$();
  var jsx$5 = acc;
  var this$3 = $m_sr_Statics$();
  var fv$2 = this.b$1;
  acc = jsx$6.mix__I__I__I(jsx$5, this$3.doubleHash__D__I(fv$2));
  var jsx$8 = $m_sr_Statics$();
  var jsx$7 = acc;
  var this$4 = $m_sr_Statics$();
  var fv$3 = this.a$1;
  acc = jsx$8.mix__I__I__I(jsx$7, this$4.doubleHash__D__I(fv$3));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 4)
});
$c_Lcom_darkoverlordofdata_demo_TintComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lcom_darkoverlordofdata_demo_TintComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_TintComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_TintComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_TintComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.TintComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_TintComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_TintComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_TintComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_TintComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.TintComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_TintComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_TintComponent: 0
}, false, "com.darkoverlordofdata.demo.TintComponent", {
  Lcom_darkoverlordofdata_demo_TintComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_TintComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_TintComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_TweenComponent() {
  $c_O.call(this);
  this.min$1 = 0.0;
  this.max$1 = 0.0;
  this.speed$1 = 0.0;
  this.repeat$1 = false;
  this.active$1 = false
}
$c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_TweenComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_TweenComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_TweenComponent.prototype = $c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype.productPrefix__T = (function() {
  return "TweenComponent"
});
$c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype.productArity__I = (function() {
  return 5
});
$c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_TweenComponent(x$1)) {
    var TweenComponent$1 = $as_Lcom_darkoverlordofdata_demo_TweenComponent(x$1);
    return (((((this.min$1 === TweenComponent$1.min$1) && (this.max$1 === TweenComponent$1.max$1)) && (this.speed$1 === TweenComponent$1.speed$1)) && (this.repeat$1 === TweenComponent$1.repeat$1)) && (this.active$1 === TweenComponent$1.active$1))
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.min$1;
      break
    }
    case 1: {
      return this.max$1;
      break
    }
    case 2: {
      return this.speed$1;
      break
    }
    case 3: {
      return this.repeat$1;
      break
    }
    case 4: {
      return this.active$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  var jsx$2 = $m_sr_Statics$();
  var jsx$1 = acc;
  var this$1 = $m_sr_Statics$();
  var fv = this.min$1;
  acc = jsx$2.mix__I__I__I(jsx$1, this$1.doubleHash__D__I(fv));
  var jsx$4 = $m_sr_Statics$();
  var jsx$3 = acc;
  var this$2 = $m_sr_Statics$();
  var fv$1 = this.max$1;
  acc = jsx$4.mix__I__I__I(jsx$3, this$2.doubleHash__D__I(fv$1));
  var jsx$6 = $m_sr_Statics$();
  var jsx$5 = acc;
  var this$3 = $m_sr_Statics$();
  var fv$2 = this.speed$1;
  acc = jsx$6.mix__I__I__I(jsx$5, this$3.doubleHash__D__I(fv$2));
  acc = $m_sr_Statics$().mix__I__I__I(acc, (this.repeat$1 ? 1231 : 1237));
  acc = $m_sr_Statics$().mix__I__I__I(acc, (this.active$1 ? 1231 : 1237));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 5)
});
$c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype.init___F__F__F__Z__Z = (function(min, max, speed, repeat, active) {
  this.min$1 = min;
  this.max$1 = max;
  this.speed$1 = speed;
  this.repeat$1 = repeat;
  this.active$1 = active;
  return this
});
function $is_Lcom_darkoverlordofdata_demo_TweenComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_TweenComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_TweenComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_TweenComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.TweenComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_TweenComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_TweenComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_TweenComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_TweenComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.TweenComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_TweenComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_TweenComponent: 0
}, false, "com.darkoverlordofdata.demo.TweenComponent", {
  Lcom_darkoverlordofdata_demo_TweenComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_TweenComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_TweenComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_VelocityComponent() {
  $c_O.call(this);
  this.x$1 = 0.0;
  this.y$1 = 0.0
}
$c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_VelocityComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_VelocityComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype = $c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype.productPrefix__T = (function() {
  return "VelocityComponent"
});
$c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype.productArity__I = (function() {
  return 2
});
$c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_VelocityComponent(x$1)) {
    var VelocityComponent$1 = $as_Lcom_darkoverlordofdata_demo_VelocityComponent(x$1);
    return ((this.x$1 === VelocityComponent$1.x$1) && (this.y$1 === VelocityComponent$1.y$1))
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.x$1;
      break
    }
    case 1: {
      return this.y$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype.init___F__F = (function(x, y) {
  this.x$1 = x;
  this.y$1 = y;
  return this
});
$c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype.hashCode__I = (function() {
  var acc = (-889275714);
  var jsx$2 = $m_sr_Statics$();
  var jsx$1 = acc;
  var this$1 = $m_sr_Statics$();
  var fv = this.x$1;
  acc = jsx$2.mix__I__I__I(jsx$1, this$1.doubleHash__D__I(fv));
  var jsx$4 = $m_sr_Statics$();
  var jsx$3 = acc;
  var this$2 = $m_sr_Statics$();
  var fv$1 = this.y$1;
  acc = jsx$4.mix__I__I__I(jsx$3, this$2.doubleHash__D__I(fv$1));
  return $m_sr_Statics$().finalizeHash__I__I__I(acc, 2)
});
$c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lcom_darkoverlordofdata_demo_VelocityComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_VelocityComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_VelocityComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_VelocityComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.VelocityComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_VelocityComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_VelocityComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_VelocityComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_VelocityComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.VelocityComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_VelocityComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_VelocityComponent: 0
}, false, "com.darkoverlordofdata.demo.VelocityComponent", {
  Lcom_darkoverlordofdata_demo_VelocityComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_VelocityComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_VelocityComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_ViewComponent() {
  $c_O.call(this);
  this.sprite$1 = null
}
$c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_ViewComponent;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_ViewComponent() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_ViewComponent.prototype = $c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype;
$c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype.productPrefix__T = (function() {
  return "ViewComponent"
});
$c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype.productArity__I = (function() {
  return 1
});
$c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype.init___Lcom_badlogic_gdx_graphics_g2d_Sprite = (function(sprite) {
  this.sprite$1 = sprite;
  return this
});
$c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_Lcom_darkoverlordofdata_demo_ViewComponent(x$1)) {
    var ViewComponent$1 = $as_Lcom_darkoverlordofdata_demo_ViewComponent(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.sprite$1, ViewComponent$1.sprite$1)
  } else {
    return false
  }
});
$c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.sprite$1;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_Lcom_darkoverlordofdata_demo_ViewComponent(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Lcom_darkoverlordofdata_demo_ViewComponent)))
}
function $as_Lcom_darkoverlordofdata_demo_ViewComponent(obj) {
  return (($is_Lcom_darkoverlordofdata_demo_ViewComponent(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "com.darkoverlordofdata.demo.ViewComponent"))
}
function $isArrayOf_Lcom_darkoverlordofdata_demo_ViewComponent(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Lcom_darkoverlordofdata_demo_ViewComponent)))
}
function $asArrayOf_Lcom_darkoverlordofdata_demo_ViewComponent(obj, depth) {
  return (($isArrayOf_Lcom_darkoverlordofdata_demo_ViewComponent(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lcom.darkoverlordofdata.demo.ViewComponent;", depth))
}
var $d_Lcom_darkoverlordofdata_demo_ViewComponent = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_ViewComponent: 0
}, false, "com.darkoverlordofdata.demo.ViewComponent", {
  Lcom_darkoverlordofdata_demo_ViewComponent: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IComponent: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_ViewComponent.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_ViewComponent;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$() {
  $c_O.call(this);
  this.$$outer$1 = null
}
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype = $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype.productPrefix__T = (function() {
  return "Enemy1"
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype.productArity__I = (function() {
  return 0
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype.toString__T = (function() {
  return "Enemy1"
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype.hashCode__I = (function() {
  return 2080116169
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype.init___Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$ = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$1 = $$outer
  };
  return this
});
var $d_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$: 0
}, false, "com.darkoverlordofdata.demo.systems.EntitySpawningTimerSystem$Enemies$Enemy1$", {
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$: 1,
  O: 1,
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$EnumVal: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy1$;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$() {
  $c_O.call(this);
  this.$$outer$1 = null
}
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype = $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype.productPrefix__T = (function() {
  return "Enemy2"
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype.productArity__I = (function() {
  return 0
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype.toString__T = (function() {
  return "Enemy2"
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype.hashCode__I = (function() {
  return 2080116170
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype.init___Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$ = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$1 = $$outer
  };
  return this
});
var $d_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$: 0
}, false, "com.darkoverlordofdata.demo.systems.EntitySpawningTimerSystem$Enemies$Enemy2$", {
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$: 1,
  O: 1,
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$EnumVal: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy2$;
/** @constructor */
function $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$() {
  $c_O.call(this);
  this.$$outer$1 = null
}
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype.constructor = $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype = $c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype;
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype.productPrefix__T = (function() {
  return "Enemy3"
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype.productArity__I = (function() {
  return 0
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype.toString__T = (function() {
  return "Enemy3"
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype.hashCode__I = (function() {
  return 2080116171
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype.init___Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$ = (function($$outer) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$1 = $$outer
  };
  return this
});
var $d_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$: 0
}, false, "com.darkoverlordofdata.demo.systems.EntitySpawningTimerSystem$Enemies$Enemy3$", {
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$: 1,
  O: 1,
  Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$EnumVal: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$.prototype.$classData = $d_Lcom_darkoverlordofdata_demo_systems_EntitySpawningTimerSystem$Enemies$Enemy3$;
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$() {
  $c_O.call(this)
}
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype = $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype;
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype.init___ = (function() {
  return this
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype.productPrefix__T = (function() {
  return "OnEntityAdded"
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype.productArity__I = (function() {
  return 0
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype.toString__T = (function() {
  return "OnEntityAdded"
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype.hashCode__I = (function() {
  return (-1763394722)
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$: 0
}, false, "com.darkoverlordofdata.entitas.GroupEventType$OnEntityAdded$", {
  Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_GroupEventType$EnumVal: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$;
var $n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$ = (void 0);
function $m_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$() {
  if ((!$n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$)) {
    $n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$ = new $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$().init___()
  };
  return $n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAdded$
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$() {
  $c_O.call(this)
}
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype = $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype;
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype.init___ = (function() {
  return this
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype.productPrefix__T = (function() {
  return "OnEntityAddedOrRemoved"
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype.productArity__I = (function() {
  return 0
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype.toString__T = (function() {
  return "OnEntityAddedOrRemoved"
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype.hashCode__I = (function() {
  return (-370795713)
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$: 0
}, false, "com.darkoverlordofdata.entitas.GroupEventType$OnEntityAddedOrRemoved$", {
  Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_GroupEventType$EnumVal: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$;
var $n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$ = (void 0);
function $m_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$() {
  if ((!$n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$)) {
    $n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$ = new $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$().init___()
  };
  return $n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityAddedOrRemoved$
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$() {
  $c_O.call(this)
}
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype = $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype;
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype.init___ = (function() {
  return this
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype.productPrefix__T = (function() {
  return "OnEntityRemoved"
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype.productArity__I = (function() {
  return 0
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype.toString__T = (function() {
  return "OnEntityRemoved"
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype.hashCode__I = (function() {
  return (-165293250)
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$ = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$: 0
}, false, "com.darkoverlordofdata.entitas.GroupEventType$OnEntityRemoved$", {
  Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_GroupEventType$EnumVal: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$;
var $n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$ = (void 0);
function $m_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$() {
  if ((!$n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$)) {
    $n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$ = new $c_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$().init___()
  };
  return $n_Lcom_darkoverlordofdata_entitas_GroupEventType$OnEntityRemoved$
}
/** @constructor */
function $c_Lcom_darkoverlordofdata_entitas_Matcher() {
  $c_O.call(this);
  this.$$undid$1 = 0;
  this.$$undindices$1 = null;
  this.toStringCache$1 = null;
  this.anyOfIndices$1 = null;
  this.allOfIndices$1 = null;
  this.noneOfIndices$1 = null
}
$c_Lcom_darkoverlordofdata_entitas_Matcher.prototype = new $h_O();
$c_Lcom_darkoverlordofdata_entitas_Matcher.prototype.constructor = $c_Lcom_darkoverlordofdata_entitas_Matcher;
/** @constructor */
function $h_Lcom_darkoverlordofdata_entitas_Matcher() {
  /*<skip>*/
}
$h_Lcom_darkoverlordofdata_entitas_Matcher.prototype = $c_Lcom_darkoverlordofdata_entitas_Matcher.prototype;
$c_Lcom_darkoverlordofdata_entitas_Matcher.prototype.init___ = (function() {
  this.$$undid$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$().uniqueId__I();
  this.$$undindices$1 = $newArrayObject($d_I.getArrayOf(), [0]);
  this.toStringCache$1 = "";
  var xs = $m_sci_Nil$();
  var len = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(xs);
  var array = $newArrayObject($d_I.getArrayOf(), [len]);
  var elem$1 = 0;
  elem$1 = 0;
  var this$5 = new $c_sc_LinearSeqLike$$anon$1().init___sc_LinearSeqLike(xs);
  while (this$5.hasNext__Z()) {
    var arg1 = this$5.next__O();
    array.u[elem$1] = $uI(arg1);
    elem$1 = ((1 + elem$1) | 0)
  };
  this.anyOfIndices$1 = array;
  var xs$1 = $m_sci_Nil$();
  var len$1 = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(xs$1);
  var array$1 = $newArrayObject($d_I.getArrayOf(), [len$1]);
  var elem$1$1 = 0;
  elem$1$1 = 0;
  var this$10 = new $c_sc_LinearSeqLike$$anon$1().init___sc_LinearSeqLike(xs$1);
  while (this$10.hasNext__Z()) {
    var arg1$1 = this$10.next__O();
    array$1.u[elem$1$1] = $uI(arg1$1);
    elem$1$1 = ((1 + elem$1$1) | 0)
  };
  this.allOfIndices$1 = array$1;
  var xs$2 = $m_sci_Nil$();
  var len$2 = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(xs$2);
  var array$2 = $newArrayObject($d_I.getArrayOf(), [len$2]);
  var elem$1$2 = 0;
  elem$1$2 = 0;
  var this$15 = new $c_sc_LinearSeqLike$$anon$1().init___sc_LinearSeqLike(xs$2);
  while (this$15.hasNext__Z()) {
    var arg1$2 = this$15.next__O();
    array$2.u[elem$1$2] = $uI(arg1$2);
    elem$1$2 = ((1 + elem$1$2) | 0)
  };
  this.noneOfIndices$1 = array$2;
  return this
});
$c_Lcom_darkoverlordofdata_entitas_Matcher.prototype.toString__T = (function() {
  if ((this.toStringCache$1 === "")) {
    var sb = new $c_scm_StringBuilder().init___();
    this.toStringHelper__p1__scm_StringBuilder__T__AI__V(sb, "AllOf", this.allOfIndices$1);
    this.toStringHelper__p1__scm_StringBuilder__T__AI__V(sb, "AnyOf", this.anyOfIndices$1);
    this.toStringHelper__p1__scm_StringBuilder__T__AI__V(sb, "NoneOf", this.noneOfIndices$1);
    var this$1 = sb.underlying$5;
    this.toStringCache$1 = this$1.content$1
  };
  return this.toStringCache$1
});
$c_Lcom_darkoverlordofdata_entitas_Matcher.prototype.indices__AI = (function() {
  if ((this.$$undindices$1.u.length === 0)) {
    this.$$undindices$1 = this.mergeIndices__AI()
  };
  return this.$$undindices$1
});
$c_Lcom_darkoverlordofdata_entitas_Matcher.prototype.mergeIndices__AI = (function() {
  var indicesList = new $c_scm_ListBuffer().init___();
  if ((this.allOfIndices$1.u.length > 0)) {
    var xs = this.allOfIndices$1;
    indicesList.$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer(new $c_scm_ArrayOps$ofInt().init___AI(xs))
  };
  if ((this.anyOfIndices$1.u.length > 0)) {
    var xs$1 = this.anyOfIndices$1;
    indicesList.$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer(new $c_scm_ArrayOps$ofInt().init___AI(xs$1))
  };
  if ((this.noneOfIndices$1.u.length > 0)) {
    var xs$2 = this.noneOfIndices$1;
    indicesList.$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer(new $c_scm_ArrayOps$ofInt().init___AI(xs$2))
  };
  var jsx$1 = $m_Lcom_darkoverlordofdata_entitas_Matcher$();
  var this$6 = indicesList.scala$collection$mutable$ListBuffer$$start$6;
  var len = $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this$6);
  var result = $newArrayObject($d_I.getArrayOf(), [len]);
  $s_sc_TraversableOnce$class__copyToArray__sc_TraversableOnce__O__I__V(this$6, result, 0);
  return jsx$1.distinctIndices__AI__AI(result)
});
$c_Lcom_darkoverlordofdata_entitas_Matcher.prototype.toStringHelper__p1__scm_StringBuilder__T__AI__V = (function(sb, prefix, indexArray) {
  if ((indexArray.u.length > 0)) {
    sb.append__T__scm_StringBuilder(prefix);
    sb.append__T__scm_StringBuilder("(");
    var end = indexArray.u.length;
    var isEmpty$4 = (end <= 0);
    var lastElement$4 = (isEmpty$4 ? (-1) : (((-1) + end) | 0));
    if ((!isEmpty$4)) {
      var i = 0;
      while (true) {
        var arg1 = i;
        sb.append__T__scm_StringBuilder(("" + arg1));
        if ((arg1 < (((-1) + indexArray.u.length) | 0))) {
          sb.append__T__scm_StringBuilder(",")
        };
        if ((i === lastElement$4)) {
          break
        };
        i = ((1 + i) | 0)
      }
    };
    sb.append__T__scm_StringBuilder(")")
  }
});
$c_Lcom_darkoverlordofdata_entitas_Matcher.prototype.matches__Lcom_darkoverlordofdata_entitas_Entity__Z = (function(entity) {
  var matchesAllOf = ((this.allOfIndices$1.u.length === 0) || entity.hasComponents__AI__Z(this.allOfIndices$1));
  var matchesAnyOf = ((this.anyOfIndices$1.u.length === 0) || entity.hasAnyComponent__AI__Z(this.anyOfIndices$1));
  var matchesNoneOf = ((this.noneOfIndices$1.u.length === 0) || (!entity.hasAnyComponent__AI__Z(this.noneOfIndices$1)));
  return ((matchesAllOf && matchesAnyOf) && matchesNoneOf)
});
var $d_Lcom_darkoverlordofdata_entitas_Matcher = new $TypeData().initClass({
  Lcom_darkoverlordofdata_entitas_Matcher: 0
}, false, "com.darkoverlordofdata.entitas.Matcher", {
  Lcom_darkoverlordofdata_entitas_Matcher: 1,
  O: 1,
  Lcom_darkoverlordofdata_entitas_IAllOfMatcher: 1,
  Lcom_darkoverlordofdata_entitas_ICompoundMatcher: 1,
  Lcom_darkoverlordofdata_entitas_IMatcher: 1,
  Lcom_darkoverlordofdata_entitas_IAnyOfMatcher: 1,
  Lcom_darkoverlordofdata_entitas_INoneOfMatcher: 1
});
$c_Lcom_darkoverlordofdata_entitas_Matcher.prototype.$classData = $d_Lcom_darkoverlordofdata_entitas_Matcher;
/** @constructor */
function $c_Ljava_io_PrintStream() {
  $c_Ljava_io_FilterOutputStream.call(this);
  this.java$io$PrintStream$$autoFlush$f = false;
  this.charset$3 = null;
  this.java$io$PrintStream$$encoder$3 = null;
  this.java$io$PrintStream$$closing$3 = false;
  this.java$io$PrintStream$$closed$3 = false;
  this.errorFlag$3 = false;
  this.bitmap$0$3 = false
}
$c_Ljava_io_PrintStream.prototype = new $h_Ljava_io_FilterOutputStream();
$c_Ljava_io_PrintStream.prototype.constructor = $c_Ljava_io_PrintStream;
/** @constructor */
function $h_Ljava_io_PrintStream() {
  /*<skip>*/
}
$h_Ljava_io_PrintStream.prototype = $c_Ljava_io_PrintStream.prototype;
$c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream__Z__Ljava_nio_charset_Charset = (function(_out, autoFlush, charset) {
  this.java$io$PrintStream$$autoFlush$f = autoFlush;
  this.charset$3 = charset;
  $c_Ljava_io_FilterOutputStream.prototype.init___Ljava_io_OutputStream.call(this, _out);
  this.java$io$PrintStream$$closing$3 = false;
  this.java$io$PrintStream$$closed$3 = false;
  this.errorFlag$3 = false;
  return this
});
function $is_Ljava_io_PrintStream(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.Ljava_io_PrintStream)))
}
function $as_Ljava_io_PrintStream(obj) {
  return (($is_Ljava_io_PrintStream(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "java.io.PrintStream"))
}
function $isArrayOf_Ljava_io_PrintStream(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.Ljava_io_PrintStream)))
}
function $asArrayOf_Ljava_io_PrintStream(obj, depth) {
  return (($isArrayOf_Ljava_io_PrintStream(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Ljava.io.PrintStream;", depth))
}
/** @constructor */
function $c_T2() {
  $c_O.call(this);
  this.$$und1$f = null;
  this.$$und2$f = null
}
$c_T2.prototype = new $h_O();
$c_T2.prototype.constructor = $c_T2;
/** @constructor */
function $h_T2() {
  /*<skip>*/
}
$h_T2.prototype = $c_T2.prototype;
$c_T2.prototype.productPrefix__T = (function() {
  return "Tuple2"
});
$c_T2.prototype.productArity__I = (function() {
  return 2
});
$c_T2.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_T2(x$1)) {
    var Tuple2$1 = $as_T2(x$1);
    return ($m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und1$f, Tuple2$1.$$und1$f) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und2$f, Tuple2$1.$$und2$f))
  } else {
    return false
  }
});
$c_T2.prototype.init___O__O = (function(_1, _2) {
  this.$$und1$f = _1;
  this.$$und2$f = _2;
  return this
});
$c_T2.prototype.productElement__I__O = (function(n) {
  return $s_s_Product2$class__productElement__s_Product2__I__O(this, n)
});
$c_T2.prototype.toString__T = (function() {
  return (((("(" + this.$$und1$f) + ",") + this.$$und2$f) + ")")
});
$c_T2.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_T2.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_T2(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.T2)))
}
function $as_T2(obj) {
  return (($is_T2(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Tuple2"))
}
function $isArrayOf_T2(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.T2)))
}
function $asArrayOf_T2(obj, depth) {
  return (($isArrayOf_T2(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Tuple2;", depth))
}
var $d_T2 = new $TypeData().initClass({
  T2: 0
}, false, "scala.Tuple2", {
  T2: 1,
  O: 1,
  s_Product2: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_T2.prototype.$classData = $d_T2;
/** @constructor */
function $c_T3() {
  $c_O.call(this);
  this.$$und1$1 = null;
  this.$$und2$1 = null;
  this.$$und3$1 = null
}
$c_T3.prototype = new $h_O();
$c_T3.prototype.constructor = $c_T3;
/** @constructor */
function $h_T3() {
  /*<skip>*/
}
$h_T3.prototype = $c_T3.prototype;
$c_T3.prototype.productPrefix__T = (function() {
  return "Tuple3"
});
$c_T3.prototype.productArity__I = (function() {
  return 3
});
$c_T3.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_T3(x$1)) {
    var Tuple3$1 = $as_T3(x$1);
    return (($m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und1$1, Tuple3$1.$$und1$1) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und2$1, Tuple3$1.$$und2$1)) && $m_sr_BoxesRunTime$().equals__O__O__Z(this.$$und3$1, Tuple3$1.$$und3$1))
  } else {
    return false
  }
});
$c_T3.prototype.productElement__I__O = (function(n) {
  return $s_s_Product3$class__productElement__s_Product3__I__O(this, n)
});
$c_T3.prototype.toString__T = (function() {
  return (((((("(" + this.$$und1$1) + ",") + this.$$und2$1) + ",") + this.$$und3$1) + ")")
});
$c_T3.prototype.init___O__O__O = (function(_1, _2, _3) {
  this.$$und1$1 = _1;
  this.$$und2$1 = _2;
  this.$$und3$1 = _3;
  return this
});
$c_T3.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_T3.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_T3(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.T3)))
}
function $as_T3(obj) {
  return (($is_T3(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Tuple3"))
}
function $isArrayOf_T3(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.T3)))
}
function $asArrayOf_T3(obj, depth) {
  return (($isArrayOf_T3(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Tuple3;", depth))
}
var $d_T3 = new $TypeData().initClass({
  T3: 0
}, false, "scala.Tuple3", {
  T3: 1,
  O: 1,
  s_Product3: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_T3.prototype.$classData = $d_T3;
/** @constructor */
function $c_s_Enumeration$Val() {
  $c_s_Enumeration$Value.call(this);
  this.i$2 = 0;
  this.name$2 = null
}
$c_s_Enumeration$Val.prototype = new $h_s_Enumeration$Value();
$c_s_Enumeration$Val.prototype.constructor = $c_s_Enumeration$Val;
/** @constructor */
function $h_s_Enumeration$Val() {
  /*<skip>*/
}
$h_s_Enumeration$Val.prototype = $c_s_Enumeration$Val.prototype;
$c_s_Enumeration$Val.prototype.toString__T = (function() {
  return ((this.name$2 !== null) ? this.name$2 : new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["<Unknown name for enum field #", " of class ", ">"])).s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.i$2, $objectGetClass(this)])))
});
$c_s_Enumeration$Val.prototype.init___s_Enumeration__I__T = (function($$outer, i, name) {
  this.i$2 = i;
  this.name$2 = name;
  $c_s_Enumeration$Value.prototype.init___s_Enumeration.call(this, $$outer);
  var this$1 = $$outer.scala$Enumeration$$vmap$1;
  var assertion = (!this$1.contains__O__Z(i));
  if ((!assertion)) {
    throw new $c_jl_AssertionError().init___O((("assertion failed: " + "Duplicate id: ") + this.i$2))
  };
  var this$3 = $$outer.scala$Enumeration$$vmap$1;
  this$3.put__O__O__s_Option(i, this);
  $$outer.scala$Enumeration$$vsetDefined$1 = false;
  $$outer.nextId$1 = ((1 + i) | 0);
  if (($$outer.nextId$1 > $$outer.scala$Enumeration$$topId$1)) {
    $$outer.scala$Enumeration$$topId$1 = $$outer.nextId$1
  };
  if ((i < $$outer.scala$Enumeration$$bottomId$1)) {
    $$outer.scala$Enumeration$$bottomId$1 = i
  };
  return this
});
var $d_s_Enumeration$Val = new $TypeData().initClass({
  s_Enumeration$Val: 0
}, false, "scala.Enumeration$Val", {
  s_Enumeration$Val: 1,
  s_Enumeration$Value: 1,
  O: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Enumeration$Val.prototype.$classData = $d_s_Enumeration$Val;
/** @constructor */
function $c_s_None$() {
  $c_s_Option.call(this)
}
$c_s_None$.prototype = new $h_s_Option();
$c_s_None$.prototype.constructor = $c_s_None$;
/** @constructor */
function $h_s_None$() {
  /*<skip>*/
}
$h_s_None$.prototype = $c_s_None$.prototype;
$c_s_None$.prototype.init___ = (function() {
  return this
});
$c_s_None$.prototype.productPrefix__T = (function() {
  return "None"
});
$c_s_None$.prototype.productArity__I = (function() {
  return 0
});
$c_s_None$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_s_None$.prototype.toString__T = (function() {
  return "None"
});
$c_s_None$.prototype.hashCode__I = (function() {
  return 2433880
});
$c_s_None$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_s_None$ = new $TypeData().initClass({
  s_None$: 0
}, false, "scala.None$", {
  s_None$: 1,
  s_Option: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_None$.prototype.$classData = $d_s_None$;
var $n_s_None$ = (void 0);
function $m_s_None$() {
  if ((!$n_s_None$)) {
    $n_s_None$ = new $c_s_None$().init___()
  };
  return $n_s_None$
}
/** @constructor */
function $c_s_Some() {
  $c_s_Option.call(this);
  this.x$2 = null
}
$c_s_Some.prototype = new $h_s_Option();
$c_s_Some.prototype.constructor = $c_s_Some;
/** @constructor */
function $h_s_Some() {
  /*<skip>*/
}
$h_s_Some.prototype = $c_s_Some.prototype;
$c_s_Some.prototype.productPrefix__T = (function() {
  return "Some"
});
$c_s_Some.prototype.productArity__I = (function() {
  return 1
});
$c_s_Some.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_s_Some(x$1)) {
    var Some$1 = $as_s_Some(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.x$2, Some$1.x$2)
  } else {
    return false
  }
});
$c_s_Some.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.x$2;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_s_Some.prototype.toString__T = (function() {
  return $m_sr_ScalaRunTime$().$$undtoString__s_Product__T(this)
});
$c_s_Some.prototype.init___O = (function(x) {
  this.x$2 = x;
  return this
});
$c_s_Some.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_s_Some.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_s_Some(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.s_Some)))
}
function $as_s_Some(obj) {
  return (($is_s_Some(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.Some"))
}
function $isArrayOf_s_Some(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.s_Some)))
}
function $asArrayOf_s_Some(obj, depth) {
  return (($isArrayOf_s_Some(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.Some;", depth))
}
var $d_s_Some = new $TypeData().initClass({
  s_Some: 0
}, false, "scala.Some", {
  s_Some: 1,
  s_Option: 1,
  O: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_Some.prototype.$classData = $d_s_Some;
/** @constructor */
function $c_s_StringContext$InvalidEscapeException() {
  $c_jl_IllegalArgumentException.call(this);
  this.index$5 = 0
}
$c_s_StringContext$InvalidEscapeException.prototype = new $h_jl_IllegalArgumentException();
$c_s_StringContext$InvalidEscapeException.prototype.constructor = $c_s_StringContext$InvalidEscapeException;
/** @constructor */
function $h_s_StringContext$InvalidEscapeException() {
  /*<skip>*/
}
$h_s_StringContext$InvalidEscapeException.prototype = $c_s_StringContext$InvalidEscapeException.prototype;
$c_s_StringContext$InvalidEscapeException.prototype.init___T__I = (function(str, index) {
  this.index$5 = index;
  var jsx$3 = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["invalid escape ", " index ", " in \"", "\". Use \\\\\\\\ for literal \\\\."]));
  $m_s_Predef$().require__Z__V(((index >= 0) && (index < $uI(str.length))));
  if ((index === (((-1) + $uI(str.length)) | 0))) {
    var jsx$1 = "at terminal"
  } else {
    var jsx$2 = new $c_s_StringContext().init___sc_Seq(new $c_sjs_js_WrappedArray().init___sjs_js_Array(["'\\\\", "' not one of ", " at"]));
    var index$1 = ((1 + index) | 0);
    var c = (65535 & $uI(str.charCodeAt(index$1)));
    var jsx$1 = jsx$2.s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([new $c_jl_Character().init___C(c), "[\\b, \\t, \\n, \\f, \\r, \\\\, \\\", \\']"]))
  };
  var s = jsx$3.s__sc_Seq__T(new $c_sjs_js_WrappedArray().init___sjs_js_Array([jsx$1, index, str]));
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, s, null);
  return this
});
var $d_s_StringContext$InvalidEscapeException = new $TypeData().initClass({
  s_StringContext$InvalidEscapeException: 0
}, false, "scala.StringContext$InvalidEscapeException", {
  s_StringContext$InvalidEscapeException: 1,
  jl_IllegalArgumentException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1
});
$c_s_StringContext$InvalidEscapeException.prototype.$classData = $d_s_StringContext$InvalidEscapeException;
function $is_sc_TraversableLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_TraversableLike)))
}
function $as_sc_TraversableLike(obj) {
  return (($is_sc_TraversableLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.TraversableLike"))
}
function $isArrayOf_sc_TraversableLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_TraversableLike)))
}
function $asArrayOf_sc_TraversableLike(obj, depth) {
  return (($isArrayOf_sc_TraversableLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.TraversableLike;", depth))
}
/** @constructor */
function $c_scg_SeqFactory() {
  $c_scg_GenSeqFactory.call(this)
}
$c_scg_SeqFactory.prototype = new $h_scg_GenSeqFactory();
$c_scg_SeqFactory.prototype.constructor = $c_scg_SeqFactory;
/** @constructor */
function $h_scg_SeqFactory() {
  /*<skip>*/
}
$h_scg_SeqFactory.prototype = $c_scg_SeqFactory.prototype;
/** @constructor */
function $c_sci_HashSet$HashTrieSet$$anon$1() {
  $c_sci_TrieIterator.call(this)
}
$c_sci_HashSet$HashTrieSet$$anon$1.prototype = new $h_sci_TrieIterator();
$c_sci_HashSet$HashTrieSet$$anon$1.prototype.constructor = $c_sci_HashSet$HashTrieSet$$anon$1;
/** @constructor */
function $h_sci_HashSet$HashTrieSet$$anon$1() {
  /*<skip>*/
}
$h_sci_HashSet$HashTrieSet$$anon$1.prototype = $c_sci_HashSet$HashTrieSet$$anon$1.prototype;
$c_sci_HashSet$HashTrieSet$$anon$1.prototype.init___sci_HashSet$HashTrieSet = (function($$outer) {
  $c_sci_TrieIterator.prototype.init___Asci_Iterable.call(this, $$outer.elems$5);
  return this
});
var $d_sci_HashSet$HashTrieSet$$anon$1 = new $TypeData().initClass({
  sci_HashSet$HashTrieSet$$anon$1: 0
}, false, "scala.collection.immutable.HashSet$HashTrieSet$$anon$1", {
  sci_HashSet$HashTrieSet$$anon$1: 1,
  sci_TrieIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1
});
$c_sci_HashSet$HashTrieSet$$anon$1.prototype.$classData = $d_sci_HashSet$HashTrieSet$$anon$1;
/** @constructor */
function $c_sci_Set$() {
  $c_scg_ImmutableSetFactory.call(this)
}
$c_sci_Set$.prototype = new $h_scg_ImmutableSetFactory();
$c_sci_Set$.prototype.constructor = $c_sci_Set$;
/** @constructor */
function $h_sci_Set$() {
  /*<skip>*/
}
$h_sci_Set$.prototype = $c_sci_Set$.prototype;
$c_sci_Set$.prototype.init___ = (function() {
  return this
});
$c_sci_Set$.prototype.emptyInstance__sci_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
var $d_sci_Set$ = new $TypeData().initClass({
  sci_Set$: 0
}, false, "scala.collection.immutable.Set$", {
  sci_Set$: 1,
  scg_ImmutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Set$.prototype.$classData = $d_sci_Set$;
var $n_sci_Set$ = (void 0);
function $m_sci_Set$() {
  if ((!$n_sci_Set$)) {
    $n_sci_Set$ = new $c_sci_Set$().init___()
  };
  return $n_sci_Set$
}
/** @constructor */
function $c_sci_VectorIterator() {
  $c_sc_AbstractIterator.call(this);
  this.endIndex$2 = 0;
  this.blockIndex$2 = 0;
  this.lo$2 = 0;
  this.endLo$2 = 0;
  this.$$undhasNext$2 = false;
  this.depth$2 = 0;
  this.display0$2 = null;
  this.display1$2 = null;
  this.display2$2 = null;
  this.display3$2 = null;
  this.display4$2 = null;
  this.display5$2 = null
}
$c_sci_VectorIterator.prototype = new $h_sc_AbstractIterator();
$c_sci_VectorIterator.prototype.constructor = $c_sci_VectorIterator;
/** @constructor */
function $h_sci_VectorIterator() {
  /*<skip>*/
}
$h_sci_VectorIterator.prototype = $c_sci_VectorIterator.prototype;
$c_sci_VectorIterator.prototype.next__O = (function() {
  if ((!this.$$undhasNext$2)) {
    throw new $c_ju_NoSuchElementException().init___T("reached iterator end")
  };
  var res = this.display0$2.u[this.lo$2];
  this.lo$2 = ((1 + this.lo$2) | 0);
  if ((this.lo$2 === this.endLo$2)) {
    if ((((this.blockIndex$2 + this.lo$2) | 0) < this.endIndex$2)) {
      var newBlockIndex = ((32 + this.blockIndex$2) | 0);
      var xor = (this.blockIndex$2 ^ newBlockIndex);
      $s_sci_VectorPointer$class__gotoNextBlockStart__sci_VectorPointer__I__I__V(this, newBlockIndex, xor);
      this.blockIndex$2 = newBlockIndex;
      var x = ((this.endIndex$2 - this.blockIndex$2) | 0);
      this.endLo$2 = ((x < 32) ? x : 32);
      this.lo$2 = 0
    } else {
      this.$$undhasNext$2 = false
    }
  };
  return res
});
$c_sci_VectorIterator.prototype.display3__AO = (function() {
  return this.display3$2
});
$c_sci_VectorIterator.prototype.depth__I = (function() {
  return this.depth$2
});
$c_sci_VectorIterator.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$2 = x$1
});
$c_sci_VectorIterator.prototype.init___I__I = (function(_startIndex, endIndex) {
  this.endIndex$2 = endIndex;
  this.blockIndex$2 = ((-32) & _startIndex);
  this.lo$2 = (31 & _startIndex);
  var x = ((endIndex - this.blockIndex$2) | 0);
  this.endLo$2 = ((x < 32) ? x : 32);
  this.$$undhasNext$2 = (((this.blockIndex$2 + this.lo$2) | 0) < endIndex);
  return this
});
$c_sci_VectorIterator.prototype.display0__AO = (function() {
  return this.display0$2
});
$c_sci_VectorIterator.prototype.display4__AO = (function() {
  return this.display4$2
});
$c_sci_VectorIterator.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$2 = x$1
});
$c_sci_VectorIterator.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$2 = x$1
});
$c_sci_VectorIterator.prototype.hasNext__Z = (function() {
  return this.$$undhasNext$2
});
$c_sci_VectorIterator.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$2 = x$1
});
$c_sci_VectorIterator.prototype.display1__AO = (function() {
  return this.display1$2
});
$c_sci_VectorIterator.prototype.display5__AO = (function() {
  return this.display5$2
});
$c_sci_VectorIterator.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$2 = x$1
});
$c_sci_VectorIterator.prototype.display2__AO = (function() {
  return this.display2$2
});
$c_sci_VectorIterator.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$2 = x$1
});
$c_sci_VectorIterator.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$2 = x$1
});
var $d_sci_VectorIterator = new $TypeData().initClass({
  sci_VectorIterator: 0
}, false, "scala.collection.immutable.VectorIterator", {
  sci_VectorIterator: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sci_VectorPointer: 1
});
$c_sci_VectorIterator.prototype.$classData = $d_sci_VectorIterator;
/** @constructor */
function $c_scm_ArrayBuilder() {
  $c_O.call(this)
}
$c_scm_ArrayBuilder.prototype = new $h_O();
$c_scm_ArrayBuilder.prototype.constructor = $c_scm_ArrayBuilder;
/** @constructor */
function $h_scm_ArrayBuilder() {
  /*<skip>*/
}
$h_scm_ArrayBuilder.prototype = $c_scm_ArrayBuilder.prototype;
$c_scm_ArrayBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
/** @constructor */
function $c_sjsr_UndefinedBehaviorError() {
  $c_jl_Error.call(this)
}
$c_sjsr_UndefinedBehaviorError.prototype = new $h_jl_Error();
$c_sjsr_UndefinedBehaviorError.prototype.constructor = $c_sjsr_UndefinedBehaviorError;
/** @constructor */
function $h_sjsr_UndefinedBehaviorError() {
  /*<skip>*/
}
$h_sjsr_UndefinedBehaviorError.prototype = $c_sjsr_UndefinedBehaviorError.prototype;
$c_sjsr_UndefinedBehaviorError.prototype.fillInStackTrace__jl_Throwable = (function() {
  return $c_jl_Throwable.prototype.fillInStackTrace__jl_Throwable.call(this)
});
$c_sjsr_UndefinedBehaviorError.prototype.init___jl_Throwable = (function(cause) {
  $c_sjsr_UndefinedBehaviorError.prototype.init___T__jl_Throwable.call(this, ("An undefined behavior was detected" + ((cause === null) ? "" : (": " + cause.getMessage__T()))), cause);
  return this
});
$c_sjsr_UndefinedBehaviorError.prototype.init___T__jl_Throwable = (function(message, cause) {
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, message, cause);
  return this
});
var $d_sjsr_UndefinedBehaviorError = new $TypeData().initClass({
  sjsr_UndefinedBehaviorError: 0
}, false, "scala.scalajs.runtime.UndefinedBehaviorError", {
  sjsr_UndefinedBehaviorError: 1,
  jl_Error: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_util_control_ControlThrowable: 1,
  s_util_control_NoStackTrace: 1
});
$c_sjsr_UndefinedBehaviorError.prototype.$classData = $d_sjsr_UndefinedBehaviorError;
/** @constructor */
function $c_sr_NonLocalReturnControl$mcZ$sp() {
  $c_sr_NonLocalReturnControl.call(this);
  this.value$mcZ$sp$f = false
}
$c_sr_NonLocalReturnControl$mcZ$sp.prototype = new $h_sr_NonLocalReturnControl();
$c_sr_NonLocalReturnControl$mcZ$sp.prototype.constructor = $c_sr_NonLocalReturnControl$mcZ$sp;
/** @constructor */
function $h_sr_NonLocalReturnControl$mcZ$sp() {
  /*<skip>*/
}
$h_sr_NonLocalReturnControl$mcZ$sp.prototype = $c_sr_NonLocalReturnControl$mcZ$sp.prototype;
$c_sr_NonLocalReturnControl$mcZ$sp.prototype.init___O__Z = (function(key, value$mcZ$sp) {
  this.value$mcZ$sp$f = value$mcZ$sp;
  $c_sr_NonLocalReturnControl.prototype.init___O__O.call(this, key, null);
  return this
});
var $d_sr_NonLocalReturnControl$mcZ$sp = new $TypeData().initClass({
  sr_NonLocalReturnControl$mcZ$sp: 0
}, false, "scala.runtime.NonLocalReturnControl$mcZ$sp", {
  sr_NonLocalReturnControl$mcZ$sp: 1,
  sr_NonLocalReturnControl: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_util_control_ControlThrowable: 1,
  s_util_control_NoStackTrace: 1
});
$c_sr_NonLocalReturnControl$mcZ$sp.prototype.$classData = $d_sr_NonLocalReturnControl$mcZ$sp;
/** @constructor */
function $c_jl_JSConsoleBasedPrintStream() {
  $c_Ljava_io_PrintStream.call(this);
  this.isErr$4 = null;
  this.flushed$4 = false;
  this.buffer$4 = null
}
$c_jl_JSConsoleBasedPrintStream.prototype = new $h_Ljava_io_PrintStream();
$c_jl_JSConsoleBasedPrintStream.prototype.constructor = $c_jl_JSConsoleBasedPrintStream;
/** @constructor */
function $h_jl_JSConsoleBasedPrintStream() {
  /*<skip>*/
}
$h_jl_JSConsoleBasedPrintStream.prototype = $c_jl_JSConsoleBasedPrintStream.prototype;
$c_jl_JSConsoleBasedPrintStream.prototype.init___jl_Boolean = (function(isErr) {
  this.isErr$4 = isErr;
  var out = new $c_jl_JSConsoleBasedPrintStream$DummyOutputStream().init___();
  $c_Ljava_io_PrintStream.prototype.init___Ljava_io_OutputStream__Z__Ljava_nio_charset_Charset.call(this, out, false, null);
  this.flushed$4 = true;
  this.buffer$4 = "";
  return this
});
$c_jl_JSConsoleBasedPrintStream.prototype.java$lang$JSConsoleBasedPrintStream$$printString__T__V = (function(s) {
  var rest = s;
  while ((rest !== "")) {
    var thiz = rest;
    var nlPos = $uI(thiz.indexOf("\n"));
    if ((nlPos < 0)) {
      this.buffer$4 = (("" + this.buffer$4) + rest);
      this.flushed$4 = false;
      rest = ""
    } else {
      var jsx$1 = this.buffer$4;
      var thiz$1 = rest;
      this.doWriteLine__p4__T__V((("" + jsx$1) + $as_T(thiz$1.substring(0, nlPos))));
      this.buffer$4 = "";
      this.flushed$4 = true;
      var thiz$2 = rest;
      var beginIndex = ((1 + nlPos) | 0);
      rest = $as_T(thiz$2.substring(beginIndex))
    }
  }
});
$c_jl_JSConsoleBasedPrintStream.prototype.doWriteLine__p4__T__V = (function(line) {
  var x = $g.console;
  if ($uZ((!(!x)))) {
    var x$1 = this.isErr$4;
    if ($uZ(x$1)) {
      var x$2 = $g.console.error;
      var jsx$1 = $uZ((!(!x$2)))
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      $g.console.error(line)
    } else {
      $g.console.log(line)
    }
  }
});
var $d_jl_JSConsoleBasedPrintStream = new $TypeData().initClass({
  jl_JSConsoleBasedPrintStream: 0
}, false, "java.lang.JSConsoleBasedPrintStream", {
  jl_JSConsoleBasedPrintStream: 1,
  Ljava_io_PrintStream: 1,
  Ljava_io_FilterOutputStream: 1,
  Ljava_io_OutputStream: 1,
  O: 1,
  Ljava_io_Closeable: 1,
  Ljava_io_Flushable: 1,
  jl_Appendable: 1
});
$c_jl_JSConsoleBasedPrintStream.prototype.$classData = $d_jl_JSConsoleBasedPrintStream;
/** @constructor */
function $c_ju_Arrays$$anon$3() {
  $c_O.call(this);
  this.cmp$1$1 = null
}
$c_ju_Arrays$$anon$3.prototype = new $h_O();
$c_ju_Arrays$$anon$3.prototype.constructor = $c_ju_Arrays$$anon$3;
/** @constructor */
function $h_ju_Arrays$$anon$3() {
  /*<skip>*/
}
$h_ju_Arrays$$anon$3.prototype = $c_ju_Arrays$$anon$3.prototype;
$c_ju_Arrays$$anon$3.prototype.init___ju_Comparator = (function(cmp$1) {
  this.cmp$1$1 = cmp$1;
  return this
});
$c_ju_Arrays$$anon$3.prototype.compare__O__O__I = (function(x, y) {
  return this.cmp$1$1.compare__O__O__I(x, y)
});
var $d_ju_Arrays$$anon$3 = new $TypeData().initClass({
  ju_Arrays$$anon$3: 0
}, false, "java.util.Arrays$$anon$3", {
  ju_Arrays$$anon$3: 1,
  O: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_ju_Arrays$$anon$3.prototype.$classData = $d_ju_Arrays$$anon$3;
/** @constructor */
function $c_s_math_Ordering$$anon$5() {
  $c_O.call(this);
  this.$$outer$1 = null;
  this.f$2$1 = null
}
$c_s_math_Ordering$$anon$5.prototype = new $h_O();
$c_s_math_Ordering$$anon$5.prototype.constructor = $c_s_math_Ordering$$anon$5;
/** @constructor */
function $h_s_math_Ordering$$anon$5() {
  /*<skip>*/
}
$h_s_math_Ordering$$anon$5.prototype = $c_s_math_Ordering$$anon$5.prototype;
$c_s_math_Ordering$$anon$5.prototype.compare__O__O__I = (function(x, y) {
  return this.$$outer$1.compare__O__O__I(this.f$2$1.apply__O__O(x), this.f$2$1.apply__O__O(y))
});
$c_s_math_Ordering$$anon$5.prototype.init___s_math_Ordering__F1 = (function($$outer, f$2) {
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$1 = $$outer
  };
  this.f$2$1 = f$2;
  return this
});
var $d_s_math_Ordering$$anon$5 = new $TypeData().initClass({
  s_math_Ordering$$anon$5: 0
}, false, "scala.math.Ordering$$anon$5", {
  s_math_Ordering$$anon$5: 1,
  O: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$$anon$5.prototype.$classData = $d_s_math_Ordering$$anon$5;
/** @constructor */
function $c_s_reflect_ClassTag$ClassClassTag() {
  $c_O.call(this);
  this.runtimeClass$1 = null
}
$c_s_reflect_ClassTag$ClassClassTag.prototype = new $h_O();
$c_s_reflect_ClassTag$ClassClassTag.prototype.constructor = $c_s_reflect_ClassTag$ClassClassTag;
/** @constructor */
function $h_s_reflect_ClassTag$ClassClassTag() {
  /*<skip>*/
}
$h_s_reflect_ClassTag$ClassClassTag.prototype = $c_s_reflect_ClassTag$ClassClassTag.prototype;
$c_s_reflect_ClassTag$ClassClassTag.prototype.newArray__I__O = (function(len) {
  return $s_s_reflect_ClassTag$class__newArray__s_reflect_ClassTag__I__O(this, len)
});
$c_s_reflect_ClassTag$ClassClassTag.prototype.equals__O__Z = (function(x) {
  return $s_s_reflect_ClassTag$class__equals__s_reflect_ClassTag__O__Z(this, x)
});
$c_s_reflect_ClassTag$ClassClassTag.prototype.toString__T = (function() {
  return $s_s_reflect_ClassTag$class__prettyprint$1__p0__s_reflect_ClassTag__jl_Class__T(this, this.runtimeClass$1)
});
$c_s_reflect_ClassTag$ClassClassTag.prototype.runtimeClass__jl_Class = (function() {
  return this.runtimeClass$1
});
$c_s_reflect_ClassTag$ClassClassTag.prototype.init___jl_Class = (function(runtimeClass) {
  this.runtimeClass$1 = runtimeClass;
  return this
});
$c_s_reflect_ClassTag$ClassClassTag.prototype.hashCode__I = (function() {
  return $m_sr_ScalaRunTime$().hash__O__I(this.runtimeClass$1)
});
var $d_s_reflect_ClassTag$ClassClassTag = new $TypeData().initClass({
  s_reflect_ClassTag$ClassClassTag: 0
}, false, "scala.reflect.ClassTag$ClassClassTag", {
  s_reflect_ClassTag$ClassClassTag: 1,
  O: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ClassTag$ClassClassTag.prototype.$classData = $d_s_reflect_ClassTag$ClassClassTag;
/** @constructor */
function $c_sc_Seq$() {
  $c_scg_SeqFactory.call(this)
}
$c_sc_Seq$.prototype = new $h_scg_SeqFactory();
$c_sc_Seq$.prototype.constructor = $c_sc_Seq$;
/** @constructor */
function $h_sc_Seq$() {
  /*<skip>*/
}
$h_sc_Seq$.prototype = $c_sc_Seq$.prototype;
$c_sc_Seq$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sc_Seq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Seq$();
  return new $c_scm_ListBuffer().init___()
});
var $d_sc_Seq$ = new $TypeData().initClass({
  sc_Seq$: 0
}, false, "scala.collection.Seq$", {
  sc_Seq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_Seq$.prototype.$classData = $d_sc_Seq$;
var $n_sc_Seq$ = (void 0);
function $m_sc_Seq$() {
  if ((!$n_sc_Seq$)) {
    $n_sc_Seq$ = new $c_sc_Seq$().init___()
  };
  return $n_sc_Seq$
}
/** @constructor */
function $c_scg_IndexedSeqFactory() {
  $c_scg_SeqFactory.call(this)
}
$c_scg_IndexedSeqFactory.prototype = new $h_scg_SeqFactory();
$c_scg_IndexedSeqFactory.prototype.constructor = $c_scg_IndexedSeqFactory;
/** @constructor */
function $h_scg_IndexedSeqFactory() {
  /*<skip>*/
}
$h_scg_IndexedSeqFactory.prototype = $c_scg_IndexedSeqFactory.prototype;
/** @constructor */
function $c_sci_Seq$() {
  $c_scg_SeqFactory.call(this)
}
$c_sci_Seq$.prototype = new $h_scg_SeqFactory();
$c_sci_Seq$.prototype.constructor = $c_sci_Seq$;
/** @constructor */
function $h_sci_Seq$() {
  /*<skip>*/
}
$h_sci_Seq$.prototype = $c_sci_Seq$.prototype;
$c_sci_Seq$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sci_Seq$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_Seq$ = new $TypeData().initClass({
  sci_Seq$: 0
}, false, "scala.collection.immutable.Seq$", {
  sci_Seq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_Seq$.prototype.$classData = $d_sci_Seq$;
var $n_sci_Seq$ = (void 0);
function $m_sci_Seq$() {
  if ((!$n_sci_Seq$)) {
    $n_sci_Seq$ = new $c_sci_Seq$().init___()
  };
  return $n_sci_Seq$
}
/** @constructor */
function $c_scm_ArrayBuilder$ofInt() {
  $c_scm_ArrayBuilder.call(this);
  this.elems$2 = null;
  this.capacity$2 = 0;
  this.size$2 = 0
}
$c_scm_ArrayBuilder$ofInt.prototype = new $h_scm_ArrayBuilder();
$c_scm_ArrayBuilder$ofInt.prototype.constructor = $c_scm_ArrayBuilder$ofInt;
/** @constructor */
function $h_scm_ArrayBuilder$ofInt() {
  /*<skip>*/
}
$h_scm_ArrayBuilder$ofInt.prototype = $c_scm_ArrayBuilder$ofInt.prototype;
$c_scm_ArrayBuilder$ofInt.prototype.init___ = (function() {
  this.capacity$2 = 0;
  this.size$2 = 0;
  return this
});
$c_scm_ArrayBuilder$ofInt.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuilder$ofInt = (function(xs) {
  if ($is_scm_WrappedArray$ofInt(xs)) {
    var x2 = $as_scm_WrappedArray$ofInt(xs);
    this.ensureSize__p2__I__V(((this.size$2 + x2.length__I()) | 0));
    $m_s_Array$().copy__O__I__O__I__I__V(x2.array$6, 0, this.elems$2, this.size$2, x2.length__I());
    this.size$2 = ((this.size$2 + x2.length__I()) | 0);
    return this
  } else {
    return $as_scm_ArrayBuilder$ofInt($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs))
  }
});
$c_scm_ArrayBuilder$ofInt.prototype.equals__O__Z = (function(other) {
  if ($is_scm_ArrayBuilder$ofInt(other)) {
    var x2 = $as_scm_ArrayBuilder$ofInt(other);
    return ((this.size$2 === x2.size$2) && (this.elems$2 === x2.elems$2))
  } else {
    return false
  }
});
$c_scm_ArrayBuilder$ofInt.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__I__scm_ArrayBuilder$ofInt($uI(elem))
});
$c_scm_ArrayBuilder$ofInt.prototype.toString__T = (function() {
  return "ArrayBuilder.ofInt"
});
$c_scm_ArrayBuilder$ofInt.prototype.result__O = (function() {
  return this.result__AI()
});
$c_scm_ArrayBuilder$ofInt.prototype.resize__p2__I__V = (function(size) {
  this.elems$2 = this.mkArray__p2__I__AI(size);
  this.capacity$2 = size
});
$c_scm_ArrayBuilder$ofInt.prototype.result__AI = (function() {
  return (((this.capacity$2 !== 0) && (this.capacity$2 === this.size$2)) ? this.elems$2 : this.mkArray__p2__I__AI(this.size$2))
});
$c_scm_ArrayBuilder$ofInt.prototype.$$plus$eq__I__scm_ArrayBuilder$ofInt = (function(elem) {
  this.ensureSize__p2__I__V(((1 + this.size$2) | 0));
  this.elems$2.u[this.size$2] = elem;
  this.size$2 = ((1 + this.size$2) | 0);
  return this
});
$c_scm_ArrayBuilder$ofInt.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__I__scm_ArrayBuilder$ofInt($uI(elem))
});
$c_scm_ArrayBuilder$ofInt.prototype.mkArray__p2__I__AI = (function(size) {
  var newelems = $newArrayObject($d_I.getArrayOf(), [size]);
  if ((this.size$2 > 0)) {
    $m_s_Array$().copy__O__I__O__I__I__V(this.elems$2, 0, newelems, 0, this.size$2)
  };
  return newelems
});
$c_scm_ArrayBuilder$ofInt.prototype.sizeHint__I__V = (function(size) {
  if ((this.capacity$2 < size)) {
    this.resize__p2__I__V(size)
  }
});
$c_scm_ArrayBuilder$ofInt.prototype.ensureSize__p2__I__V = (function(size) {
  if (((this.capacity$2 < size) || (this.capacity$2 === 0))) {
    var newsize = ((this.capacity$2 === 0) ? 16 : (this.capacity$2 << 1));
    while ((newsize < size)) {
      newsize = (newsize << 1)
    };
    this.resize__p2__I__V(newsize)
  }
});
$c_scm_ArrayBuilder$ofInt.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuilder$ofInt(xs)
});
function $is_scm_ArrayBuilder$ofInt(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ArrayBuilder$ofInt)))
}
function $as_scm_ArrayBuilder$ofInt(obj) {
  return (($is_scm_ArrayBuilder$ofInt(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ArrayBuilder$ofInt"))
}
function $isArrayOf_scm_ArrayBuilder$ofInt(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ArrayBuilder$ofInt)))
}
function $asArrayOf_scm_ArrayBuilder$ofInt(obj, depth) {
  return (($isArrayOf_scm_ArrayBuilder$ofInt(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ArrayBuilder$ofInt;", depth))
}
var $d_scm_ArrayBuilder$ofInt = new $TypeData().initClass({
  scm_ArrayBuilder$ofInt: 0
}, false, "scala.collection.mutable.ArrayBuilder$ofInt", {
  scm_ArrayBuilder$ofInt: 1,
  scm_ArrayBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ArrayBuilder$ofInt.prototype.$classData = $d_scm_ArrayBuilder$ofInt;
/** @constructor */
function $c_scm_ArrayBuilder$ofRef() {
  $c_scm_ArrayBuilder.call(this);
  this.evidence$2$2 = null;
  this.elems$2 = null;
  this.capacity$2 = 0;
  this.size$2 = 0
}
$c_scm_ArrayBuilder$ofRef.prototype = new $h_scm_ArrayBuilder();
$c_scm_ArrayBuilder$ofRef.prototype.constructor = $c_scm_ArrayBuilder$ofRef;
/** @constructor */
function $h_scm_ArrayBuilder$ofRef() {
  /*<skip>*/
}
$h_scm_ArrayBuilder$ofRef.prototype = $c_scm_ArrayBuilder$ofRef.prototype;
$c_scm_ArrayBuilder$ofRef.prototype.init___s_reflect_ClassTag = (function(evidence$2) {
  this.evidence$2$2 = evidence$2;
  this.capacity$2 = 0;
  this.size$2 = 0;
  return this
});
$c_scm_ArrayBuilder$ofRef.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuilder$ofRef = (function(xs) {
  if ($is_scm_WrappedArray$ofRef(xs)) {
    var x2 = $as_scm_WrappedArray$ofRef(xs);
    this.ensureSize__p2__I__V(((this.size$2 + x2.length__I()) | 0));
    $m_s_Array$().copy__O__I__O__I__I__V(x2.array$6, 0, this.elems$2, this.size$2, x2.length__I());
    this.size$2 = ((this.size$2 + x2.length__I()) | 0);
    return this
  } else {
    return $as_scm_ArrayBuilder$ofRef($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs))
  }
});
$c_scm_ArrayBuilder$ofRef.prototype.equals__O__Z = (function(other) {
  if ($is_scm_ArrayBuilder$ofRef(other)) {
    var x2 = $as_scm_ArrayBuilder$ofRef(other);
    return ((this.size$2 === x2.size$2) && (this.elems$2 === x2.elems$2))
  } else {
    return false
  }
});
$c_scm_ArrayBuilder$ofRef.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_ArrayBuilder$ofRef(elem)
});
$c_scm_ArrayBuilder$ofRef.prototype.toString__T = (function() {
  return "ArrayBuilder.ofRef"
});
$c_scm_ArrayBuilder$ofRef.prototype.result__O = (function() {
  return this.result__AO()
});
$c_scm_ArrayBuilder$ofRef.prototype.resize__p2__I__V = (function(size) {
  this.elems$2 = this.mkArray__p2__I__AO(size);
  this.capacity$2 = size
});
$c_scm_ArrayBuilder$ofRef.prototype.$$plus$eq__O__scm_ArrayBuilder$ofRef = (function(elem) {
  this.ensureSize__p2__I__V(((1 + this.size$2) | 0));
  this.elems$2.u[this.size$2] = elem;
  this.size$2 = ((1 + this.size$2) | 0);
  return this
});
$c_scm_ArrayBuilder$ofRef.prototype.result__AO = (function() {
  return (((this.capacity$2 !== 0) && (this.capacity$2 === this.size$2)) ? this.elems$2 : this.mkArray__p2__I__AO(this.size$2))
});
$c_scm_ArrayBuilder$ofRef.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_ArrayBuilder$ofRef(elem)
});
$c_scm_ArrayBuilder$ofRef.prototype.sizeHint__I__V = (function(size) {
  if ((this.capacity$2 < size)) {
    this.resize__p2__I__V(size)
  }
});
$c_scm_ArrayBuilder$ofRef.prototype.ensureSize__p2__I__V = (function(size) {
  if (((this.capacity$2 < size) || (this.capacity$2 === 0))) {
    var newsize = ((this.capacity$2 === 0) ? 16 : (this.capacity$2 << 1));
    while ((newsize < size)) {
      newsize = (newsize << 1)
    };
    this.resize__p2__I__V(newsize)
  }
});
$c_scm_ArrayBuilder$ofRef.prototype.mkArray__p2__I__AO = (function(size) {
  var newelems = $asArrayOf_O(this.evidence$2$2.newArray__I__O(size), 1);
  if ((this.size$2 > 0)) {
    $m_s_Array$().copy__O__I__O__I__I__V(this.elems$2, 0, newelems, 0, this.size$2)
  };
  return newelems
});
$c_scm_ArrayBuilder$ofRef.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuilder$ofRef(xs)
});
function $is_scm_ArrayBuilder$ofRef(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ArrayBuilder$ofRef)))
}
function $as_scm_ArrayBuilder$ofRef(obj) {
  return (($is_scm_ArrayBuilder$ofRef(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ArrayBuilder$ofRef"))
}
function $isArrayOf_scm_ArrayBuilder$ofRef(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ArrayBuilder$ofRef)))
}
function $asArrayOf_scm_ArrayBuilder$ofRef(obj, depth) {
  return (($isArrayOf_scm_ArrayBuilder$ofRef(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ArrayBuilder$ofRef;", depth))
}
var $d_scm_ArrayBuilder$ofRef = new $TypeData().initClass({
  scm_ArrayBuilder$ofRef: 0
}, false, "scala.collection.mutable.ArrayBuilder$ofRef", {
  scm_ArrayBuilder$ofRef: 1,
  scm_ArrayBuilder: 1,
  O: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ArrayBuilder$ofRef.prototype.$classData = $d_scm_ArrayBuilder$ofRef;
/** @constructor */
function $c_scm_IndexedSeq$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_IndexedSeq$.prototype = new $h_scg_SeqFactory();
$c_scm_IndexedSeq$.prototype.constructor = $c_scm_IndexedSeq$;
/** @constructor */
function $h_scm_IndexedSeq$() {
  /*<skip>*/
}
$h_scm_IndexedSeq$.prototype = $c_scm_IndexedSeq$.prototype;
$c_scm_IndexedSeq$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_scm_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ArrayBuffer().init___()
});
var $d_scm_IndexedSeq$ = new $TypeData().initClass({
  scm_IndexedSeq$: 0
}, false, "scala.collection.mutable.IndexedSeq$", {
  scm_IndexedSeq$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_scm_IndexedSeq$.prototype.$classData = $d_scm_IndexedSeq$;
var $n_scm_IndexedSeq$ = (void 0);
function $m_scm_IndexedSeq$() {
  if ((!$n_scm_IndexedSeq$)) {
    $n_scm_IndexedSeq$ = new $c_scm_IndexedSeq$().init___()
  };
  return $n_scm_IndexedSeq$
}
/** @constructor */
function $c_sjs_js_WrappedArray$() {
  $c_scg_SeqFactory.call(this)
}
$c_sjs_js_WrappedArray$.prototype = new $h_scg_SeqFactory();
$c_sjs_js_WrappedArray$.prototype.constructor = $c_sjs_js_WrappedArray$;
/** @constructor */
function $h_sjs_js_WrappedArray$() {
  /*<skip>*/
}
$h_sjs_js_WrappedArray$.prototype = $c_sjs_js_WrappedArray$.prototype;
$c_sjs_js_WrappedArray$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sjs_js_WrappedArray$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sjs_js_WrappedArray().init___()
});
var $d_sjs_js_WrappedArray$ = new $TypeData().initClass({
  sjs_js_WrappedArray$: 0
}, false, "scala.scalajs.js.WrappedArray$", {
  sjs_js_WrappedArray$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sjs_js_WrappedArray$.prototype.$classData = $d_sjs_js_WrappedArray$;
var $n_sjs_js_WrappedArray$ = (void 0);
function $m_sjs_js_WrappedArray$() {
  if ((!$n_sjs_js_WrappedArray$)) {
    $n_sjs_js_WrappedArray$ = new $c_sjs_js_WrappedArray$().init___()
  };
  return $n_sjs_js_WrappedArray$
}
/** @constructor */
function $c_s_math_Ordering$Int$() {
  $c_O.call(this)
}
$c_s_math_Ordering$Int$.prototype = new $h_O();
$c_s_math_Ordering$Int$.prototype.constructor = $c_s_math_Ordering$Int$;
/** @constructor */
function $h_s_math_Ordering$Int$() {
  /*<skip>*/
}
$h_s_math_Ordering$Int$.prototype = $c_s_math_Ordering$Int$.prototype;
$c_s_math_Ordering$Int$.prototype.init___ = (function() {
  return this
});
$c_s_math_Ordering$Int$.prototype.compare__O__O__I = (function(x, y) {
  var x$1 = $uI(x);
  var y$1 = $uI(y);
  return $s_s_math_Ordering$IntOrdering$class__compare__s_math_Ordering$IntOrdering__I__I__I(this, x$1, y$1)
});
var $d_s_math_Ordering$Int$ = new $TypeData().initClass({
  s_math_Ordering$Int$: 0
}, false, "scala.math.Ordering$Int$", {
  s_math_Ordering$Int$: 1,
  O: 1,
  s_math_Ordering$IntOrdering: 1,
  s_math_Ordering: 1,
  ju_Comparator: 1,
  s_math_PartialOrdering: 1,
  s_math_Equiv: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_s_math_Ordering$Int$.prototype.$classData = $d_s_math_Ordering$Int$;
var $n_s_math_Ordering$Int$ = (void 0);
function $m_s_math_Ordering$Int$() {
  if ((!$n_s_math_Ordering$Int$)) {
    $n_s_math_Ordering$Int$ = new $c_s_math_Ordering$Int$().init___()
  };
  return $n_s_math_Ordering$Int$
}
/** @constructor */
function $c_s_reflect_AnyValManifest() {
  $c_O.call(this);
  this.toString$1 = null
}
$c_s_reflect_AnyValManifest.prototype = new $h_O();
$c_s_reflect_AnyValManifest.prototype.constructor = $c_s_reflect_AnyValManifest;
/** @constructor */
function $h_s_reflect_AnyValManifest() {
  /*<skip>*/
}
$h_s_reflect_AnyValManifest.prototype = $c_s_reflect_AnyValManifest.prototype;
$c_s_reflect_AnyValManifest.prototype.equals__O__Z = (function(that) {
  return (this === that)
});
$c_s_reflect_AnyValManifest.prototype.toString__T = (function() {
  return this.toString$1
});
$c_s_reflect_AnyValManifest.prototype.hashCode__I = (function() {
  return $systemIdentityHashCode(this)
});
/** @constructor */
function $c_s_reflect_ManifestFactory$ClassTypeManifest() {
  $c_O.call(this);
  this.prefix$1 = null;
  this.runtimeClass1$1 = null;
  this.typeArguments$1 = null
}
$c_s_reflect_ManifestFactory$ClassTypeManifest.prototype = new $h_O();
$c_s_reflect_ManifestFactory$ClassTypeManifest.prototype.constructor = $c_s_reflect_ManifestFactory$ClassTypeManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$ClassTypeManifest() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ClassTypeManifest.prototype = $c_s_reflect_ManifestFactory$ClassTypeManifest.prototype;
/** @constructor */
function $c_sc_IndexedSeq$() {
  $c_scg_IndexedSeqFactory.call(this);
  this.ReusableCBF$6 = null
}
$c_sc_IndexedSeq$.prototype = new $h_scg_IndexedSeqFactory();
$c_sc_IndexedSeq$.prototype.constructor = $c_sc_IndexedSeq$;
/** @constructor */
function $h_sc_IndexedSeq$() {
  /*<skip>*/
}
$h_sc_IndexedSeq$.prototype = $c_sc_IndexedSeq$.prototype;
$c_sc_IndexedSeq$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  $n_sc_IndexedSeq$ = this;
  this.ReusableCBF$6 = new $c_sc_IndexedSeq$$anon$1().init___();
  return this
});
$c_sc_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_IndexedSeq$();
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sc_IndexedSeq$ = new $TypeData().initClass({
  sc_IndexedSeq$: 0
}, false, "scala.collection.IndexedSeq$", {
  sc_IndexedSeq$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sc_IndexedSeq$.prototype.$classData = $d_sc_IndexedSeq$;
var $n_sc_IndexedSeq$ = (void 0);
function $m_sc_IndexedSeq$() {
  if ((!$n_sc_IndexedSeq$)) {
    $n_sc_IndexedSeq$ = new $c_sc_IndexedSeq$().init___()
  };
  return $n_sc_IndexedSeq$
}
/** @constructor */
function $c_sc_IndexedSeqLike$Elements() {
  $c_sc_AbstractIterator.call(this);
  this.end$2 = 0;
  this.index$2 = 0;
  this.$$outer$f = null
}
$c_sc_IndexedSeqLike$Elements.prototype = new $h_sc_AbstractIterator();
$c_sc_IndexedSeqLike$Elements.prototype.constructor = $c_sc_IndexedSeqLike$Elements;
/** @constructor */
function $h_sc_IndexedSeqLike$Elements() {
  /*<skip>*/
}
$h_sc_IndexedSeqLike$Elements.prototype = $c_sc_IndexedSeqLike$Elements.prototype;
$c_sc_IndexedSeqLike$Elements.prototype.next__O = (function() {
  if ((this.index$2 >= this.end$2)) {
    $m_sc_Iterator$().empty$1.next__O()
  };
  var x = this.$$outer$f.apply__I__O(this.index$2);
  this.index$2 = ((1 + this.index$2) | 0);
  return x
});
$c_sc_IndexedSeqLike$Elements.prototype.init___sc_IndexedSeqLike__I__I = (function($$outer, start, end) {
  this.end$2 = end;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  this.index$2 = start;
  return this
});
$c_sc_IndexedSeqLike$Elements.prototype.hasNext__Z = (function() {
  return (this.index$2 < this.end$2)
});
var $d_sc_IndexedSeqLike$Elements = new $TypeData().initClass({
  sc_IndexedSeqLike$Elements: 0
}, false, "scala.collection.IndexedSeqLike$Elements", {
  sc_IndexedSeqLike$Elements: 1,
  sc_AbstractIterator: 1,
  O: 1,
  sc_Iterator: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_BufferedIterator: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sc_IndexedSeqLike$Elements.prototype.$classData = $d_sc_IndexedSeqLike$Elements;
/** @constructor */
function $c_sci_HashSet$() {
  $c_scg_ImmutableSetFactory.call(this)
}
$c_sci_HashSet$.prototype = new $h_scg_ImmutableSetFactory();
$c_sci_HashSet$.prototype.constructor = $c_sci_HashSet$;
/** @constructor */
function $h_sci_HashSet$() {
  /*<skip>*/
}
$h_sci_HashSet$.prototype = $c_sci_HashSet$.prototype;
$c_sci_HashSet$.prototype.init___ = (function() {
  return this
});
$c_sci_HashSet$.prototype.scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet = (function(hash0, elem0, hash1, elem1, level) {
  var index0 = (31 & ((hash0 >>> level) | 0));
  var index1 = (31 & ((hash1 >>> level) | 0));
  if ((index0 !== index1)) {
    var bitmap = ((1 << index0) | (1 << index1));
    var elems = $newArrayObject($d_sci_HashSet.getArrayOf(), [2]);
    if ((index0 < index1)) {
      elems.u[0] = elem0;
      elems.u[1] = elem1
    } else {
      elems.u[0] = elem1;
      elems.u[1] = elem0
    };
    return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(bitmap, elems, ((elem0.size__I() + elem1.size__I()) | 0))
  } else {
    var elems$2 = $newArrayObject($d_sci_HashSet.getArrayOf(), [1]);
    var bitmap$2 = (1 << index0);
    var child = this.scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet(hash0, elem0, hash1, elem1, ((5 + level) | 0));
    elems$2.u[0] = child;
    return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(bitmap$2, elems$2, child.size0$5)
  }
});
$c_sci_HashSet$.prototype.emptyInstance__sci_Set = (function() {
  return $m_sci_HashSet$EmptyHashSet$()
});
var $d_sci_HashSet$ = new $TypeData().initClass({
  sci_HashSet$: 0
}, false, "scala.collection.immutable.HashSet$", {
  sci_HashSet$: 1,
  scg_ImmutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$.prototype.$classData = $d_sci_HashSet$;
var $n_sci_HashSet$ = (void 0);
function $m_sci_HashSet$() {
  if ((!$n_sci_HashSet$)) {
    $n_sci_HashSet$ = new $c_sci_HashSet$().init___()
  };
  return $n_sci_HashSet$
}
/** @constructor */
function $c_sci_IndexedSeq$() {
  $c_scg_IndexedSeqFactory.call(this)
}
$c_sci_IndexedSeq$.prototype = new $h_scg_IndexedSeqFactory();
$c_sci_IndexedSeq$.prototype.constructor = $c_sci_IndexedSeq$;
/** @constructor */
function $h_sci_IndexedSeq$() {
  /*<skip>*/
}
$h_sci_IndexedSeq$.prototype = $c_sci_IndexedSeq$.prototype;
$c_sci_IndexedSeq$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sci_IndexedSeq$.prototype.newBuilder__scm_Builder = (function() {
  $m_sci_Vector$();
  return new $c_sci_VectorBuilder().init___()
});
var $d_sci_IndexedSeq$ = new $TypeData().initClass({
  sci_IndexedSeq$: 0
}, false, "scala.collection.immutable.IndexedSeq$", {
  sci_IndexedSeq$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1
});
$c_sci_IndexedSeq$.prototype.$classData = $d_sci_IndexedSeq$;
var $n_sci_IndexedSeq$ = (void 0);
function $m_sci_IndexedSeq$() {
  if ((!$n_sci_IndexedSeq$)) {
    $n_sci_IndexedSeq$ = new $c_sci_IndexedSeq$().init___()
  };
  return $n_sci_IndexedSeq$
}
/** @constructor */
function $c_sci_ListSet$() {
  $c_scg_ImmutableSetFactory.call(this)
}
$c_sci_ListSet$.prototype = new $h_scg_ImmutableSetFactory();
$c_sci_ListSet$.prototype.constructor = $c_sci_ListSet$;
/** @constructor */
function $h_sci_ListSet$() {
  /*<skip>*/
}
$h_sci_ListSet$.prototype = $c_sci_ListSet$.prototype;
$c_sci_ListSet$.prototype.init___ = (function() {
  return this
});
$c_sci_ListSet$.prototype.emptyInstance__sci_Set = (function() {
  return $m_sci_ListSet$EmptyListSet$()
});
$c_sci_ListSet$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sci_ListSet$ListSetBuilder().init___()
});
var $d_sci_ListSet$ = new $TypeData().initClass({
  sci_ListSet$: 0
}, false, "scala.collection.immutable.ListSet$", {
  sci_ListSet$: 1,
  scg_ImmutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_ListSet$.prototype.$classData = $d_sci_ListSet$;
var $n_sci_ListSet$ = (void 0);
function $m_sci_ListSet$() {
  if ((!$n_sci_ListSet$)) {
    $n_sci_ListSet$ = new $c_sci_ListSet$().init___()
  };
  return $n_sci_ListSet$
}
/** @constructor */
function $c_scm_HashSet$() {
  $c_scg_MutableSetFactory.call(this)
}
$c_scm_HashSet$.prototype = new $h_scg_MutableSetFactory();
$c_scm_HashSet$.prototype.constructor = $c_scm_HashSet$;
/** @constructor */
function $h_scm_HashSet$() {
  /*<skip>*/
}
$h_scm_HashSet$.prototype = $c_scm_HashSet$.prototype;
$c_scm_HashSet$.prototype.init___ = (function() {
  return this
});
$c_scm_HashSet$.prototype.empty__sc_GenTraversable = (function() {
  return new $c_scm_HashSet().init___()
});
var $d_scm_HashSet$ = new $TypeData().initClass({
  scm_HashSet$: 0
}, false, "scala.collection.mutable.HashSet$", {
  scm_HashSet$: 1,
  scg_MutableSetFactory: 1,
  scg_SetFactory: 1,
  scg_GenSetFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_HashSet$.prototype.$classData = $d_scm_HashSet$;
var $n_scm_HashSet$ = (void 0);
function $m_scm_HashSet$() {
  if ((!$n_scm_HashSet$)) {
    $n_scm_HashSet$ = new $c_scm_HashSet$().init___()
  };
  return $n_scm_HashSet$
}
/** @constructor */
function $c_sjs_js_JavaScriptException() {
  $c_jl_RuntimeException.call(this);
  this.exception$4 = null
}
$c_sjs_js_JavaScriptException.prototype = new $h_jl_RuntimeException();
$c_sjs_js_JavaScriptException.prototype.constructor = $c_sjs_js_JavaScriptException;
/** @constructor */
function $h_sjs_js_JavaScriptException() {
  /*<skip>*/
}
$h_sjs_js_JavaScriptException.prototype = $c_sjs_js_JavaScriptException.prototype;
$c_sjs_js_JavaScriptException.prototype.productPrefix__T = (function() {
  return "JavaScriptException"
});
$c_sjs_js_JavaScriptException.prototype.productArity__I = (function() {
  return 1
});
$c_sjs_js_JavaScriptException.prototype.fillInStackTrace__jl_Throwable = (function() {
  var e = this.exception$4;
  this.stackdata = e;
  return this
});
$c_sjs_js_JavaScriptException.prototype.equals__O__Z = (function(x$1) {
  if ((this === x$1)) {
    return true
  } else if ($is_sjs_js_JavaScriptException(x$1)) {
    var JavaScriptException$1 = $as_sjs_js_JavaScriptException(x$1);
    return $m_sr_BoxesRunTime$().equals__O__O__Z(this.exception$4, JavaScriptException$1.exception$4)
  } else {
    return false
  }
});
$c_sjs_js_JavaScriptException.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.exception$4;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_sjs_js_JavaScriptException.prototype.toString__T = (function() {
  return $objectToString(this.exception$4)
});
$c_sjs_js_JavaScriptException.prototype.init___O = (function(exception) {
  this.exception$4 = exception;
  $c_jl_Throwable.prototype.init___T__jl_Throwable.call(this, null, null);
  return this
});
$c_sjs_js_JavaScriptException.prototype.hashCode__I = (function() {
  var this$2 = $m_s_util_hashing_MurmurHash3$();
  return this$2.productHash__s_Product__I__I(this, (-889275714))
});
$c_sjs_js_JavaScriptException.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_sjs_js_JavaScriptException(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sjs_js_JavaScriptException)))
}
function $as_sjs_js_JavaScriptException(obj) {
  return (($is_sjs_js_JavaScriptException(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.scalajs.js.JavaScriptException"))
}
function $isArrayOf_sjs_js_JavaScriptException(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sjs_js_JavaScriptException)))
}
function $asArrayOf_sjs_js_JavaScriptException(obj, depth) {
  return (($isArrayOf_sjs_js_JavaScriptException(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.scalajs.js.JavaScriptException;", depth))
}
var $d_sjs_js_JavaScriptException = new $TypeData().initClass({
  sjs_js_JavaScriptException: 0
}, false, "scala.scalajs.js.JavaScriptException", {
  sjs_js_JavaScriptException: 1,
  jl_RuntimeException: 1,
  jl_Exception: 1,
  jl_Throwable: 1,
  O: 1,
  Ljava_io_Serializable: 1,
  s_Product: 1,
  s_Equals: 1,
  s_Serializable: 1
});
$c_sjs_js_JavaScriptException.prototype.$classData = $d_sjs_js_JavaScriptException;
/** @constructor */
function $c_s_reflect_ManifestFactory$BooleanManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$BooleanManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$BooleanManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$BooleanManifest$.prototype = $c_s_reflect_ManifestFactory$BooleanManifest$.prototype;
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype.init___ = (function() {
  this.toString$1 = "Boolean";
  return this
});
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_Z.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_Z.getClassOf()
});
var $d_s_reflect_ManifestFactory$BooleanManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$BooleanManifest$: 0
}, false, "scala.reflect.ManifestFactory$BooleanManifest$", {
  s_reflect_ManifestFactory$BooleanManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$BooleanManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$BooleanManifest$;
var $n_s_reflect_ManifestFactory$BooleanManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$BooleanManifest$() {
  if ((!$n_s_reflect_ManifestFactory$BooleanManifest$)) {
    $n_s_reflect_ManifestFactory$BooleanManifest$ = new $c_s_reflect_ManifestFactory$BooleanManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$BooleanManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$ByteManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$ByteManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$ByteManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$ByteManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ByteManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ByteManifest$.prototype = $c_s_reflect_ManifestFactory$ByteManifest$.prototype;
$c_s_reflect_ManifestFactory$ByteManifest$.prototype.init___ = (function() {
  this.toString$1 = "Byte";
  return this
});
$c_s_reflect_ManifestFactory$ByteManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_B.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$ByteManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_B.getClassOf()
});
var $d_s_reflect_ManifestFactory$ByteManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$ByteManifest$: 0
}, false, "scala.reflect.ManifestFactory$ByteManifest$", {
  s_reflect_ManifestFactory$ByteManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$ByteManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$ByteManifest$;
var $n_s_reflect_ManifestFactory$ByteManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$ByteManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ByteManifest$)) {
    $n_s_reflect_ManifestFactory$ByteManifest$ = new $c_s_reflect_ManifestFactory$ByteManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$ByteManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$CharManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$CharManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$CharManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$CharManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$CharManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$CharManifest$.prototype = $c_s_reflect_ManifestFactory$CharManifest$.prototype;
$c_s_reflect_ManifestFactory$CharManifest$.prototype.init___ = (function() {
  this.toString$1 = "Char";
  return this
});
$c_s_reflect_ManifestFactory$CharManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_C.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$CharManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_C.getClassOf()
});
var $d_s_reflect_ManifestFactory$CharManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$CharManifest$: 0
}, false, "scala.reflect.ManifestFactory$CharManifest$", {
  s_reflect_ManifestFactory$CharManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$CharManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$CharManifest$;
var $n_s_reflect_ManifestFactory$CharManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$CharManifest$() {
  if ((!$n_s_reflect_ManifestFactory$CharManifest$)) {
    $n_s_reflect_ManifestFactory$CharManifest$ = new $c_s_reflect_ManifestFactory$CharManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$CharManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$DoubleManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$DoubleManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$DoubleManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$DoubleManifest$.prototype = $c_s_reflect_ManifestFactory$DoubleManifest$.prototype;
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype.init___ = (function() {
  this.toString$1 = "Double";
  return this
});
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_D.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_D.getClassOf()
});
var $d_s_reflect_ManifestFactory$DoubleManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$DoubleManifest$: 0
}, false, "scala.reflect.ManifestFactory$DoubleManifest$", {
  s_reflect_ManifestFactory$DoubleManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$DoubleManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$DoubleManifest$;
var $n_s_reflect_ManifestFactory$DoubleManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$DoubleManifest$() {
  if ((!$n_s_reflect_ManifestFactory$DoubleManifest$)) {
    $n_s_reflect_ManifestFactory$DoubleManifest$ = new $c_s_reflect_ManifestFactory$DoubleManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$DoubleManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$FloatManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$FloatManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$FloatManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$FloatManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$FloatManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$FloatManifest$.prototype = $c_s_reflect_ManifestFactory$FloatManifest$.prototype;
$c_s_reflect_ManifestFactory$FloatManifest$.prototype.init___ = (function() {
  this.toString$1 = "Float";
  return this
});
$c_s_reflect_ManifestFactory$FloatManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_F.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$FloatManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_F.getClassOf()
});
var $d_s_reflect_ManifestFactory$FloatManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$FloatManifest$: 0
}, false, "scala.reflect.ManifestFactory$FloatManifest$", {
  s_reflect_ManifestFactory$FloatManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$FloatManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$FloatManifest$;
var $n_s_reflect_ManifestFactory$FloatManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$FloatManifest$() {
  if ((!$n_s_reflect_ManifestFactory$FloatManifest$)) {
    $n_s_reflect_ManifestFactory$FloatManifest$ = new $c_s_reflect_ManifestFactory$FloatManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$FloatManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$IntManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$IntManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$IntManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$IntManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$IntManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$IntManifest$.prototype = $c_s_reflect_ManifestFactory$IntManifest$.prototype;
$c_s_reflect_ManifestFactory$IntManifest$.prototype.init___ = (function() {
  this.toString$1 = "Int";
  return this
});
$c_s_reflect_ManifestFactory$IntManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_I.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$IntManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_I.getClassOf()
});
var $d_s_reflect_ManifestFactory$IntManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$IntManifest$: 0
}, false, "scala.reflect.ManifestFactory$IntManifest$", {
  s_reflect_ManifestFactory$IntManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$IntManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$IntManifest$;
var $n_s_reflect_ManifestFactory$IntManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$IntManifest$() {
  if ((!$n_s_reflect_ManifestFactory$IntManifest$)) {
    $n_s_reflect_ManifestFactory$IntManifest$ = new $c_s_reflect_ManifestFactory$IntManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$IntManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$LongManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$LongManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$LongManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$LongManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$LongManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$LongManifest$.prototype = $c_s_reflect_ManifestFactory$LongManifest$.prototype;
$c_s_reflect_ManifestFactory$LongManifest$.prototype.init___ = (function() {
  this.toString$1 = "Long";
  return this
});
$c_s_reflect_ManifestFactory$LongManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_J.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$LongManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_J.getClassOf()
});
var $d_s_reflect_ManifestFactory$LongManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$LongManifest$: 0
}, false, "scala.reflect.ManifestFactory$LongManifest$", {
  s_reflect_ManifestFactory$LongManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$LongManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$LongManifest$;
var $n_s_reflect_ManifestFactory$LongManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$LongManifest$() {
  if ((!$n_s_reflect_ManifestFactory$LongManifest$)) {
    $n_s_reflect_ManifestFactory$LongManifest$ = new $c_s_reflect_ManifestFactory$LongManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$LongManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$PhantomManifest() {
  $c_s_reflect_ManifestFactory$ClassTypeManifest.call(this);
  this.toString$2 = null
}
$c_s_reflect_ManifestFactory$PhantomManifest.prototype = new $h_s_reflect_ManifestFactory$ClassTypeManifest();
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.constructor = $c_s_reflect_ManifestFactory$PhantomManifest;
/** @constructor */
function $h_s_reflect_ManifestFactory$PhantomManifest() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$PhantomManifest.prototype = $c_s_reflect_ManifestFactory$PhantomManifest.prototype;
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.equals__O__Z = (function(that) {
  return (this === that)
});
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.toString__T = (function() {
  return this.toString$2
});
$c_s_reflect_ManifestFactory$PhantomManifest.prototype.hashCode__I = (function() {
  return $systemIdentityHashCode(this)
});
/** @constructor */
function $c_s_reflect_ManifestFactory$ShortManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$ShortManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$ShortManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$ShortManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ShortManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ShortManifest$.prototype = $c_s_reflect_ManifestFactory$ShortManifest$.prototype;
$c_s_reflect_ManifestFactory$ShortManifest$.prototype.init___ = (function() {
  this.toString$1 = "Short";
  return this
});
$c_s_reflect_ManifestFactory$ShortManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_S.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$ShortManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_S.getClassOf()
});
var $d_s_reflect_ManifestFactory$ShortManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$ShortManifest$: 0
}, false, "scala.reflect.ManifestFactory$ShortManifest$", {
  s_reflect_ManifestFactory$ShortManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$ShortManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$ShortManifest$;
var $n_s_reflect_ManifestFactory$ShortManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$ShortManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ShortManifest$)) {
    $n_s_reflect_ManifestFactory$ShortManifest$ = new $c_s_reflect_ManifestFactory$ShortManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$ShortManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$UnitManifest$() {
  $c_s_reflect_AnyValManifest.call(this)
}
$c_s_reflect_ManifestFactory$UnitManifest$.prototype = new $h_s_reflect_AnyValManifest();
$c_s_reflect_ManifestFactory$UnitManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$UnitManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$UnitManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$UnitManifest$.prototype = $c_s_reflect_ManifestFactory$UnitManifest$.prototype;
$c_s_reflect_ManifestFactory$UnitManifest$.prototype.init___ = (function() {
  this.toString$1 = "Unit";
  return this
});
$c_s_reflect_ManifestFactory$UnitManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_sr_BoxedUnit.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$UnitManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_V.getClassOf()
});
var $d_s_reflect_ManifestFactory$UnitManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$UnitManifest$: 0
}, false, "scala.reflect.ManifestFactory$UnitManifest$", {
  s_reflect_ManifestFactory$UnitManifest$: 1,
  s_reflect_AnyValManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$UnitManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$UnitManifest$;
var $n_s_reflect_ManifestFactory$UnitManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$UnitManifest$() {
  if ((!$n_s_reflect_ManifestFactory$UnitManifest$)) {
    $n_s_reflect_ManifestFactory$UnitManifest$ = new $c_s_reflect_ManifestFactory$UnitManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$UnitManifest$
}
function $is_sc_IterableLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_IterableLike)))
}
function $as_sc_IterableLike(obj) {
  return (($is_sc_IterableLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.IterableLike"))
}
function $isArrayOf_sc_IterableLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_IterableLike)))
}
function $asArrayOf_sc_IterableLike(obj, depth) {
  return (($isArrayOf_sc_IterableLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.IterableLike;", depth))
}
/** @constructor */
function $c_sci_List$() {
  $c_scg_SeqFactory.call(this);
  this.partialNotApplied$5 = null
}
$c_sci_List$.prototype = new $h_scg_SeqFactory();
$c_sci_List$.prototype.constructor = $c_sci_List$;
/** @constructor */
function $h_sci_List$() {
  /*<skip>*/
}
$h_sci_List$.prototype = $c_sci_List$.prototype;
$c_sci_List$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  $n_sci_List$ = this;
  this.partialNotApplied$5 = new $c_sci_List$$anon$1().init___();
  return this
});
$c_sci_List$.prototype.empty__sc_GenTraversable = (function() {
  return $m_sci_Nil$()
});
$c_sci_List$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ListBuffer().init___()
});
var $d_sci_List$ = new $TypeData().initClass({
  sci_List$: 0
}, false, "scala.collection.immutable.List$", {
  sci_List$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_List$.prototype.$classData = $d_sci_List$;
var $n_sci_List$ = (void 0);
function $m_sci_List$() {
  if ((!$n_sci_List$)) {
    $n_sci_List$ = new $c_sci_List$().init___()
  };
  return $n_sci_List$
}
/** @constructor */
function $c_sci_Stream$() {
  $c_scg_SeqFactory.call(this)
}
$c_sci_Stream$.prototype = new $h_scg_SeqFactory();
$c_sci_Stream$.prototype.constructor = $c_sci_Stream$;
/** @constructor */
function $h_sci_Stream$() {
  /*<skip>*/
}
$h_sci_Stream$.prototype = $c_sci_Stream$.prototype;
$c_sci_Stream$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_sci_Stream$.prototype.empty__sc_GenTraversable = (function() {
  return $m_sci_Stream$Empty$()
});
$c_sci_Stream$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sci_Stream$StreamBuilder().init___()
});
var $d_sci_Stream$ = new $TypeData().initClass({
  sci_Stream$: 0
}, false, "scala.collection.immutable.Stream$", {
  sci_Stream$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$.prototype.$classData = $d_sci_Stream$;
var $n_sci_Stream$ = (void 0);
function $m_sci_Stream$() {
  if ((!$n_sci_Stream$)) {
    $n_sci_Stream$ = new $c_sci_Stream$().init___()
  };
  return $n_sci_Stream$
}
/** @constructor */
function $c_scm_ArrayBuffer$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_ArrayBuffer$.prototype = new $h_scg_SeqFactory();
$c_scm_ArrayBuffer$.prototype.constructor = $c_scm_ArrayBuffer$;
/** @constructor */
function $h_scm_ArrayBuffer$() {
  /*<skip>*/
}
$h_scm_ArrayBuffer$.prototype = $c_scm_ArrayBuffer$.prototype;
$c_scm_ArrayBuffer$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_scm_ArrayBuffer$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ArrayBuffer().init___()
});
var $d_scm_ArrayBuffer$ = new $TypeData().initClass({
  scm_ArrayBuffer$: 0
}, false, "scala.collection.mutable.ArrayBuffer$", {
  scm_ArrayBuffer$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ArrayBuffer$.prototype.$classData = $d_scm_ArrayBuffer$;
var $n_scm_ArrayBuffer$ = (void 0);
function $m_scm_ArrayBuffer$() {
  if ((!$n_scm_ArrayBuffer$)) {
    $n_scm_ArrayBuffer$ = new $c_scm_ArrayBuffer$().init___()
  };
  return $n_scm_ArrayBuffer$
}
/** @constructor */
function $c_scm_ListBuffer$() {
  $c_scg_SeqFactory.call(this)
}
$c_scm_ListBuffer$.prototype = new $h_scg_SeqFactory();
$c_scm_ListBuffer$.prototype.constructor = $c_scm_ListBuffer$;
/** @constructor */
function $h_scm_ListBuffer$() {
  /*<skip>*/
}
$h_scm_ListBuffer$.prototype = $c_scm_ListBuffer$.prototype;
$c_scm_ListBuffer$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  return this
});
$c_scm_ListBuffer$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_GrowingBuilder().init___scg_Growable(new $c_scm_ListBuffer().init___())
});
var $d_scm_ListBuffer$ = new $TypeData().initClass({
  scm_ListBuffer$: 0
}, false, "scala.collection.mutable.ListBuffer$", {
  scm_ListBuffer$: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ListBuffer$.prototype.$classData = $d_scm_ListBuffer$;
var $n_scm_ListBuffer$ = (void 0);
function $m_scm_ListBuffer$() {
  if ((!$n_scm_ListBuffer$)) {
    $n_scm_ListBuffer$ = new $c_scm_ListBuffer$().init___()
  };
  return $n_scm_ListBuffer$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$AnyManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$AnyManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$AnyManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$AnyManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$AnyManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$AnyManifest$.prototype = $c_s_reflect_ManifestFactory$AnyManifest$.prototype;
$c_s_reflect_ManifestFactory$AnyManifest$.prototype.init___ = (function() {
  this.toString$2 = "Any";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_O.getClassOf();
  this.typeArguments$1 = typeArguments;
  return this
});
$c_s_reflect_ManifestFactory$AnyManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_O.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$AnyManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_O.getClassOf()
});
var $d_s_reflect_ManifestFactory$AnyManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$AnyManifest$: 0
}, false, "scala.reflect.ManifestFactory$AnyManifest$", {
  s_reflect_ManifestFactory$AnyManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$AnyManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$AnyManifest$;
var $n_s_reflect_ManifestFactory$AnyManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$AnyManifest$() {
  if ((!$n_s_reflect_ManifestFactory$AnyManifest$)) {
    $n_s_reflect_ManifestFactory$AnyManifest$ = new $c_s_reflect_ManifestFactory$AnyManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$AnyManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$AnyValManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$AnyValManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$AnyValManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$AnyValManifest$.prototype = $c_s_reflect_ManifestFactory$AnyValManifest$.prototype;
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype.init___ = (function() {
  this.toString$2 = "AnyVal";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_O.getClassOf();
  this.typeArguments$1 = typeArguments;
  return this
});
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_O.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_O.getClassOf()
});
var $d_s_reflect_ManifestFactory$AnyValManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$AnyValManifest$: 0
}, false, "scala.reflect.ManifestFactory$AnyValManifest$", {
  s_reflect_ManifestFactory$AnyValManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$AnyValManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$AnyValManifest$;
var $n_s_reflect_ManifestFactory$AnyValManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$AnyValManifest$() {
  if ((!$n_s_reflect_ManifestFactory$AnyValManifest$)) {
    $n_s_reflect_ManifestFactory$AnyValManifest$ = new $c_s_reflect_ManifestFactory$AnyValManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$AnyValManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$NothingManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$NothingManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$NothingManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$NothingManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$NothingManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$NothingManifest$.prototype = $c_s_reflect_ManifestFactory$NothingManifest$.prototype;
$c_s_reflect_ManifestFactory$NothingManifest$.prototype.init___ = (function() {
  this.toString$2 = "Nothing";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_sr_Nothing$.getClassOf();
  this.typeArguments$1 = typeArguments;
  return this
});
$c_s_reflect_ManifestFactory$NothingManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_O.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$NothingManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_sr_Nothing$.getClassOf()
});
var $d_s_reflect_ManifestFactory$NothingManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$NothingManifest$: 0
}, false, "scala.reflect.ManifestFactory$NothingManifest$", {
  s_reflect_ManifestFactory$NothingManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$NothingManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$NothingManifest$;
var $n_s_reflect_ManifestFactory$NothingManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$NothingManifest$() {
  if ((!$n_s_reflect_ManifestFactory$NothingManifest$)) {
    $n_s_reflect_ManifestFactory$NothingManifest$ = new $c_s_reflect_ManifestFactory$NothingManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$NothingManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$NullManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$NullManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$NullManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$NullManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$NullManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$NullManifest$.prototype = $c_s_reflect_ManifestFactory$NullManifest$.prototype;
$c_s_reflect_ManifestFactory$NullManifest$.prototype.init___ = (function() {
  this.toString$2 = "Null";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_sr_Null$.getClassOf();
  this.typeArguments$1 = typeArguments;
  return this
});
$c_s_reflect_ManifestFactory$NullManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_O.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$NullManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_sr_Null$.getClassOf()
});
var $d_s_reflect_ManifestFactory$NullManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$NullManifest$: 0
}, false, "scala.reflect.ManifestFactory$NullManifest$", {
  s_reflect_ManifestFactory$NullManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$NullManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$NullManifest$;
var $n_s_reflect_ManifestFactory$NullManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$NullManifest$() {
  if ((!$n_s_reflect_ManifestFactory$NullManifest$)) {
    $n_s_reflect_ManifestFactory$NullManifest$ = new $c_s_reflect_ManifestFactory$NullManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$NullManifest$
}
/** @constructor */
function $c_s_reflect_ManifestFactory$ObjectManifest$() {
  $c_s_reflect_ManifestFactory$PhantomManifest.call(this)
}
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype = new $h_s_reflect_ManifestFactory$PhantomManifest();
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.constructor = $c_s_reflect_ManifestFactory$ObjectManifest$;
/** @constructor */
function $h_s_reflect_ManifestFactory$ObjectManifest$() {
  /*<skip>*/
}
$h_s_reflect_ManifestFactory$ObjectManifest$.prototype = $c_s_reflect_ManifestFactory$ObjectManifest$.prototype;
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.init___ = (function() {
  this.toString$2 = "Object";
  var prefix = $m_s_None$();
  var typeArguments = $m_sci_Nil$();
  this.prefix$1 = prefix;
  this.runtimeClass1$1 = $d_O.getClassOf();
  this.typeArguments$1 = typeArguments;
  return this
});
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.newArray__I__O = (function(len) {
  return $newArrayObject($d_O.getArrayOf(), [len])
});
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.runtimeClass__jl_Class = (function() {
  return $d_O.getClassOf()
});
var $d_s_reflect_ManifestFactory$ObjectManifest$ = new $TypeData().initClass({
  s_reflect_ManifestFactory$ObjectManifest$: 0
}, false, "scala.reflect.ManifestFactory$ObjectManifest$", {
  s_reflect_ManifestFactory$ObjectManifest$: 1,
  s_reflect_ManifestFactory$PhantomManifest: 1,
  s_reflect_ManifestFactory$ClassTypeManifest: 1,
  O: 1,
  s_reflect_Manifest: 1,
  s_reflect_ClassTag: 1,
  s_reflect_ClassManifestDeprecatedApis: 1,
  s_reflect_OptManifest: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  s_Equals: 1
});
$c_s_reflect_ManifestFactory$ObjectManifest$.prototype.$classData = $d_s_reflect_ManifestFactory$ObjectManifest$;
var $n_s_reflect_ManifestFactory$ObjectManifest$ = (void 0);
function $m_s_reflect_ManifestFactory$ObjectManifest$() {
  if ((!$n_s_reflect_ManifestFactory$ObjectManifest$)) {
    $n_s_reflect_ManifestFactory$ObjectManifest$ = new $c_s_reflect_ManifestFactory$ObjectManifest$().init___()
  };
  return $n_s_reflect_ManifestFactory$ObjectManifest$
}
function $is_sc_GenMap(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenMap)))
}
function $as_sc_GenMap(obj) {
  return (($is_sc_GenMap(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenMap"))
}
function $isArrayOf_sc_GenMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenMap)))
}
function $asArrayOf_sc_GenMap(obj, depth) {
  return (($isArrayOf_sc_GenMap(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenMap;", depth))
}
function $is_sc_GenSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenSeq)))
}
function $as_sc_GenSeq(obj) {
  return (($is_sc_GenSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenSeq"))
}
function $isArrayOf_sc_GenSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenSeq)))
}
function $asArrayOf_sc_GenSeq(obj, depth) {
  return (($isArrayOf_sc_GenSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenSeq;", depth))
}
/** @constructor */
function $c_sci_Vector$() {
  $c_scg_IndexedSeqFactory.call(this);
  this.NIL$6 = null;
  this.Log2ConcatFaster$6 = 0;
  this.TinyAppendFaster$6 = 0
}
$c_sci_Vector$.prototype = new $h_scg_IndexedSeqFactory();
$c_sci_Vector$.prototype.constructor = $c_sci_Vector$;
/** @constructor */
function $h_sci_Vector$() {
  /*<skip>*/
}
$h_sci_Vector$.prototype = $c_sci_Vector$.prototype;
$c_sci_Vector$.prototype.init___ = (function() {
  $c_scg_GenTraversableFactory.prototype.init___.call(this);
  $n_sci_Vector$ = this;
  this.NIL$6 = new $c_sci_Vector().init___I__I__I(0, 0, 0);
  return this
});
$c_sci_Vector$.prototype.empty__sc_GenTraversable = (function() {
  return this.NIL$6
});
$c_sci_Vector$.prototype.newBuilder__scm_Builder = (function() {
  return new $c_sci_VectorBuilder().init___()
});
var $d_sci_Vector$ = new $TypeData().initClass({
  sci_Vector$: 0
}, false, "scala.collection.immutable.Vector$", {
  sci_Vector$: 1,
  scg_IndexedSeqFactory: 1,
  scg_SeqFactory: 1,
  scg_GenSeqFactory: 1,
  scg_GenTraversableFactory: 1,
  scg_GenericCompanion: 1,
  O: 1,
  scg_TraversableFactory: 1,
  scg_GenericSeqCompanion: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Vector$.prototype.$classData = $d_sci_Vector$;
var $n_sci_Vector$ = (void 0);
function $m_sci_Vector$() {
  if ((!$n_sci_Vector$)) {
    $n_sci_Vector$ = new $c_sci_Vector$().init___()
  };
  return $n_sci_Vector$
}
/** @constructor */
function $c_sc_AbstractTraversable() {
  $c_O.call(this)
}
$c_sc_AbstractTraversable.prototype = new $h_O();
$c_sc_AbstractTraversable.prototype.constructor = $c_sc_AbstractTraversable;
/** @constructor */
function $h_sc_AbstractTraversable() {
  /*<skip>*/
}
$h_sc_AbstractTraversable.prototype = $c_sc_AbstractTraversable.prototype;
$c_sc_AbstractTraversable.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sc_AbstractTraversable.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_AbstractTraversable.prototype.tail__O = (function() {
  return $s_sc_TraversableLike$class__tail__sc_TraversableLike__O(this)
});
$c_sc_AbstractTraversable.prototype.repr__O = (function() {
  return this
});
$c_sc_AbstractTraversable.prototype.newBuilder__scm_Builder = (function() {
  return this.companion__scg_GenericCompanion().newBuilder__scm_Builder()
});
$c_sc_AbstractTraversable.prototype.stringPrefix__T = (function() {
  return $s_sc_TraversableLike$class__stringPrefix__sc_TraversableLike__T(this)
});
function $is_sc_SeqLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_SeqLike)))
}
function $as_sc_SeqLike(obj) {
  return (($is_sc_SeqLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.SeqLike"))
}
function $isArrayOf_sc_SeqLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_SeqLike)))
}
function $asArrayOf_sc_SeqLike(obj, depth) {
  return (($isArrayOf_sc_SeqLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.SeqLike;", depth))
}
function $is_sc_GenSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_GenSet)))
}
function $as_sc_GenSet(obj) {
  return (($is_sc_GenSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.GenSet"))
}
function $isArrayOf_sc_GenSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_GenSet)))
}
function $asArrayOf_sc_GenSet(obj, depth) {
  return (($isArrayOf_sc_GenSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.GenSet;", depth))
}
function $is_sc_IndexedSeqLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_IndexedSeqLike)))
}
function $as_sc_IndexedSeqLike(obj) {
  return (($is_sc_IndexedSeqLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.IndexedSeqLike"))
}
function $isArrayOf_sc_IndexedSeqLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_IndexedSeqLike)))
}
function $asArrayOf_sc_IndexedSeqLike(obj, depth) {
  return (($isArrayOf_sc_IndexedSeqLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.IndexedSeqLike;", depth))
}
function $is_sc_LinearSeqLike(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeqLike)))
}
function $as_sc_LinearSeqLike(obj) {
  return (($is_sc_LinearSeqLike(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeqLike"))
}
function $isArrayOf_sc_LinearSeqLike(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeqLike)))
}
function $asArrayOf_sc_LinearSeqLike(obj, depth) {
  return (($isArrayOf_sc_LinearSeqLike(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeqLike;", depth))
}
function $is_sc_LinearSeqOptimized(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeqOptimized)))
}
function $as_sc_LinearSeqOptimized(obj) {
  return (($is_sc_LinearSeqOptimized(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeqOptimized"))
}
function $isArrayOf_sc_LinearSeqOptimized(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeqOptimized)))
}
function $asArrayOf_sc_LinearSeqOptimized(obj, depth) {
  return (($isArrayOf_sc_LinearSeqOptimized(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeqOptimized;", depth))
}
/** @constructor */
function $c_sc_AbstractIterable() {
  $c_sc_AbstractTraversable.call(this)
}
$c_sc_AbstractIterable.prototype = new $h_sc_AbstractTraversable();
$c_sc_AbstractIterable.prototype.constructor = $c_sc_AbstractIterable;
/** @constructor */
function $h_sc_AbstractIterable() {
  /*<skip>*/
}
$h_sc_AbstractIterable.prototype = $c_sc_AbstractIterable.prototype;
$c_sc_AbstractIterable.prototype.head__O = (function() {
  return this.iterator__sc_Iterator().next__O()
});
$c_sc_AbstractIterable.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IterableLike$class__sameElements__sc_IterableLike__sc_GenIterable__Z(this, that)
});
$c_sc_AbstractIterable.prototype.forall__F1__Z = (function(p) {
  var this$1 = this.iterator__sc_Iterator();
  return $s_sc_Iterator$class__forall__sc_Iterator__F1__Z(this$1, p)
});
$c_sc_AbstractIterable.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.iterator__sc_Iterator();
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this$1, f)
});
$c_sc_AbstractIterable.prototype.toStream__sci_Stream = (function() {
  return this.iterator__sc_Iterator().toStream__sci_Stream()
});
$c_sc_AbstractIterable.prototype.drop__I__O = (function(n) {
  return $s_sc_IterableLike$class__drop__sc_IterableLike__I__O(this, n)
});
$c_sc_AbstractIterable.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IterableLike$class__copyToArray__sc_IterableLike__O__I__I__V(this, xs, start, len)
});
function $is_sc_AbstractIterable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_AbstractIterable)))
}
function $as_sc_AbstractIterable(obj) {
  return (($is_sc_AbstractIterable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.AbstractIterable"))
}
function $isArrayOf_sc_AbstractIterable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_AbstractIterable)))
}
function $asArrayOf_sc_AbstractIterable(obj, depth) {
  return (($isArrayOf_sc_AbstractIterable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.AbstractIterable;", depth))
}
function $is_sci_Iterable(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Iterable)))
}
function $as_sci_Iterable(obj) {
  return (($is_sci_Iterable(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Iterable"))
}
function $isArrayOf_sci_Iterable(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Iterable)))
}
function $asArrayOf_sci_Iterable(obj, depth) {
  return (($isArrayOf_sci_Iterable(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Iterable;", depth))
}
var $d_sci_Iterable = new $TypeData().initClass({
  sci_Iterable: 0
}, true, "scala.collection.immutable.Iterable", {
  sci_Iterable: 1,
  sci_Traversable: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  s_Immutable: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1
});
/** @constructor */
function $c_sci_StringOps() {
  $c_O.call(this);
  this.repr$1 = null
}
$c_sci_StringOps.prototype = new $h_O();
$c_sci_StringOps.prototype.constructor = $c_sci_StringOps;
/** @constructor */
function $h_sci_StringOps() {
  /*<skip>*/
}
$h_sci_StringOps.prototype = $c_sci_StringOps.prototype;
$c_sci_StringOps.prototype.seq__sc_TraversableOnce = (function() {
  var $$this = this.repr$1;
  return new $c_sci_WrappedString().init___T($$this)
});
$c_sci_StringOps.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_sci_StringOps.prototype.apply__I__O = (function(idx) {
  var $$this = this.repr$1;
  var c = (65535 & $uI($$this.charCodeAt(idx)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_StringOps.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_sci_StringOps.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_StringOps.prototype.indices__sci_Range = (function() {
  return $s_sc_SeqLike$class__indices__sc_SeqLike__sci_Range(this)
});
$c_sci_StringOps.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_sci_StringOps.prototype.thisCollection__sc_Traversable = (function() {
  var $$this = this.repr$1;
  return new $c_sci_WrappedString().init___T($$this)
});
$c_sci_StringOps.prototype.equals__O__Z = (function(x$1) {
  return $m_sci_StringOps$().equals$extension__T__O__Z(this.repr$1, x$1)
});
$c_sci_StringOps.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sci_StringOps.prototype.toString__T = (function() {
  var $$this = this.repr$1;
  return $$this
});
$c_sci_StringOps.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_sci_StringOps.prototype.slice__I__I__O = (function(from, until) {
  return $m_sci_StringOps$().slice$extension__T__I__I__T(this.repr$1, from, until)
});
$c_sci_StringOps.prototype.size__I = (function() {
  var $$this = this.repr$1;
  return $uI($$this.length)
});
$c_sci_StringOps.prototype.iterator__sc_Iterator = (function() {
  var $$this = this.repr$1;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI($$this.length))
});
$c_sci_StringOps.prototype.length__I = (function() {
  var $$this = this.repr$1;
  return $uI($$this.length)
});
$c_sci_StringOps.prototype.toStream__sci_Stream = (function() {
  var $$this = this.repr$1;
  var this$3 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI($$this.length));
  return $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream(this$3)
});
$c_sci_StringOps.prototype.drop__I__O = (function(n) {
  var $$this = this.repr$1;
  var until = $uI($$this.length);
  return $m_sci_StringOps$().slice$extension__T__I__I__T(this.repr$1, n, until)
});
$c_sci_StringOps.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_sci_StringOps.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sci_StringOps.prototype.repr__O = (function() {
  return this.repr$1
});
$c_sci_StringOps.prototype.hashCode__I = (function() {
  var $$this = this.repr$1;
  return $m_sjsr_RuntimeString$().hashCode__T__I($$this)
});
$c_sci_StringOps.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_sci_StringOps.prototype.init___T = (function(repr) {
  this.repr$1 = repr;
  return this
});
$c_sci_StringOps.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_StringBuilder().init___()
});
$c_sci_StringOps.prototype.stringPrefix__T = (function() {
  return $s_sc_TraversableLike$class__stringPrefix__sc_TraversableLike__T(this)
});
function $is_sci_StringOps(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_StringOps)))
}
function $as_sci_StringOps(obj) {
  return (($is_sci_StringOps(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.StringOps"))
}
function $isArrayOf_sci_StringOps(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_StringOps)))
}
function $asArrayOf_sci_StringOps(obj, depth) {
  return (($isArrayOf_sci_StringOps(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.StringOps;", depth))
}
var $d_sci_StringOps = new $TypeData().initClass({
  sci_StringOps: 0
}, false, "scala.collection.immutable.StringOps", {
  sci_StringOps: 1,
  O: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  sc_IndexedSeqLike: 1,
  sc_SeqLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenIterableLike: 1,
  sc_GenSeqLike: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1
});
$c_sci_StringOps.prototype.$classData = $d_sci_StringOps;
function $is_sc_Seq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_Seq)))
}
function $as_sc_Seq(obj) {
  return (($is_sc_Seq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.Seq"))
}
function $isArrayOf_sc_Seq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_Seq)))
}
function $asArrayOf_sc_Seq(obj, depth) {
  return (($isArrayOf_sc_Seq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.Seq;", depth))
}
/** @constructor */
function $c_scm_ArrayOps$ofInt() {
  $c_O.call(this);
  this.repr$1 = null
}
$c_scm_ArrayOps$ofInt.prototype = new $h_O();
$c_scm_ArrayOps$ofInt.prototype.constructor = $c_scm_ArrayOps$ofInt;
/** @constructor */
function $h_scm_ArrayOps$ofInt() {
  /*<skip>*/
}
$h_scm_ArrayOps$ofInt.prototype = $c_scm_ArrayOps$ofInt.prototype;
$c_scm_ArrayOps$ofInt.prototype.seq__sc_TraversableOnce = (function() {
  var $$this = this.repr$1;
  return new $c_scm_WrappedArray$ofInt().init___AI($$this)
});
$c_scm_ArrayOps$ofInt.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_scm_ArrayOps$ofInt.prototype.apply__I__O = (function(idx) {
  var $$this = this.repr$1;
  return $$this.u[idx]
});
$c_scm_ArrayOps$ofInt.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_scm_ArrayOps$ofInt.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_scm_ArrayOps$ofInt.prototype.indices__sci_Range = (function() {
  return $s_sc_SeqLike$class__indices__sc_SeqLike__sci_Range(this)
});
$c_scm_ArrayOps$ofInt.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_scm_ArrayOps$ofInt.prototype.thisCollection__sc_Traversable = (function() {
  var $$this = this.repr$1;
  return new $c_scm_WrappedArray$ofInt().init___AI($$this)
});
$c_scm_ArrayOps$ofInt.prototype.equals__O__Z = (function(x$1) {
  return $m_scm_ArrayOps$ofInt$().equals$extension__AI__O__Z(this.repr$1, x$1)
});
$c_scm_ArrayOps$ofInt.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_scm_ArrayOps$ofInt.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_scm_ArrayOps$ofInt.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_scm_ArrayOps$ofInt.prototype.slice__I__I__O = (function(from, until) {
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, from, until)
});
$c_scm_ArrayOps$ofInt.prototype.size__I = (function() {
  var $$this = this.repr$1;
  return $$this.u.length
});
$c_scm_ArrayOps$ofInt.prototype.iterator__sc_Iterator = (function() {
  var $$this = this.repr$1;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $$this.u.length)
});
$c_scm_ArrayOps$ofInt.prototype.init___AI = (function(repr) {
  this.repr$1 = repr;
  return this
});
$c_scm_ArrayOps$ofInt.prototype.length__I = (function() {
  var $$this = this.repr$1;
  return $$this.u.length
});
$c_scm_ArrayOps$ofInt.prototype.toStream__sci_Stream = (function() {
  var $$this = this.repr$1;
  var this$2 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $$this.u.length);
  return $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream(this$2)
});
$c_scm_ArrayOps$ofInt.prototype.drop__I__O = (function(n) {
  var $$this = this.repr$1;
  var until = $$this.u.length;
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, n, until)
});
$c_scm_ArrayOps$ofInt.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_scm_ArrayOps$ofInt.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_scm_ArrayOps$ofInt.prototype.repr__O = (function() {
  return this.repr$1
});
$c_scm_ArrayOps$ofInt.prototype.hashCode__I = (function() {
  var $$this = this.repr$1;
  return $$this.hashCode__I()
});
$c_scm_ArrayOps$ofInt.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_scm_ArrayOps$class__copyToArray__scm_ArrayOps__O__I__I__V(this, xs, start, len)
});
$c_scm_ArrayOps$ofInt.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_ArrayBuilder$ofInt().init___()
});
$c_scm_ArrayOps$ofInt.prototype.stringPrefix__T = (function() {
  return $s_sc_TraversableLike$class__stringPrefix__sc_TraversableLike__T(this)
});
function $is_scm_ArrayOps$ofInt(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ArrayOps$ofInt)))
}
function $as_scm_ArrayOps$ofInt(obj) {
  return (($is_scm_ArrayOps$ofInt(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ArrayOps$ofInt"))
}
function $isArrayOf_scm_ArrayOps$ofInt(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ArrayOps$ofInt)))
}
function $asArrayOf_scm_ArrayOps$ofInt(obj, depth) {
  return (($isArrayOf_scm_ArrayOps$ofInt(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ArrayOps$ofInt;", depth))
}
var $d_scm_ArrayOps$ofInt = new $TypeData().initClass({
  scm_ArrayOps$ofInt: 0
}, false, "scala.collection.mutable.ArrayOps$ofInt", {
  scm_ArrayOps$ofInt: 1,
  O: 1,
  scm_ArrayOps: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  scm_IndexedSeqLike: 1,
  sc_IndexedSeqLike: 1,
  sc_SeqLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenIterableLike: 1,
  sc_GenSeqLike: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1
});
$c_scm_ArrayOps$ofInt.prototype.$classData = $d_scm_ArrayOps$ofInt;
/** @constructor */
function $c_scm_ArrayOps$ofRef() {
  $c_O.call(this);
  this.repr$1 = null
}
$c_scm_ArrayOps$ofRef.prototype = new $h_O();
$c_scm_ArrayOps$ofRef.prototype.constructor = $c_scm_ArrayOps$ofRef;
/** @constructor */
function $h_scm_ArrayOps$ofRef() {
  /*<skip>*/
}
$h_scm_ArrayOps$ofRef.prototype = $c_scm_ArrayOps$ofRef.prototype;
$c_scm_ArrayOps$ofRef.prototype.seq__sc_TraversableOnce = (function() {
  var $$this = this.repr$1;
  return new $c_scm_WrappedArray$ofRef().init___AO($$this)
});
$c_scm_ArrayOps$ofRef.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_scm_ArrayOps$ofRef.prototype.apply__I__O = (function(index) {
  var $$this = this.repr$1;
  return $$this.u[index]
});
$c_scm_ArrayOps$ofRef.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_scm_ArrayOps$ofRef.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_scm_ArrayOps$ofRef.prototype.indices__sci_Range = (function() {
  return $s_sc_SeqLike$class__indices__sc_SeqLike__sci_Range(this)
});
$c_scm_ArrayOps$ofRef.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_scm_ArrayOps$ofRef.prototype.thisCollection__sc_Traversable = (function() {
  var $$this = this.repr$1;
  return new $c_scm_WrappedArray$ofRef().init___AO($$this)
});
$c_scm_ArrayOps$ofRef.prototype.equals__O__Z = (function(x$1) {
  return $m_scm_ArrayOps$ofRef$().equals$extension__AO__O__Z(this.repr$1, x$1)
});
$c_scm_ArrayOps$ofRef.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_scm_ArrayOps$ofRef.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_scm_ArrayOps$ofRef.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_scm_ArrayOps$ofRef.prototype.slice__I__I__O = (function(from, until) {
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, from, until)
});
$c_scm_ArrayOps$ofRef.prototype.size__I = (function() {
  var $$this = this.repr$1;
  return $$this.u.length
});
$c_scm_ArrayOps$ofRef.prototype.init___AO = (function(repr) {
  this.repr$1 = repr;
  return this
});
$c_scm_ArrayOps$ofRef.prototype.iterator__sc_Iterator = (function() {
  var $$this = this.repr$1;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $$this.u.length)
});
$c_scm_ArrayOps$ofRef.prototype.length__I = (function() {
  var $$this = this.repr$1;
  return $$this.u.length
});
$c_scm_ArrayOps$ofRef.prototype.toStream__sci_Stream = (function() {
  var $$this = this.repr$1;
  var this$2 = new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $$this.u.length);
  return $s_sc_Iterator$class__toStream__sc_Iterator__sci_Stream(this$2)
});
$c_scm_ArrayOps$ofRef.prototype.drop__I__O = (function(n) {
  var $$this = this.repr$1;
  var until = $$this.u.length;
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, n, until)
});
$c_scm_ArrayOps$ofRef.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_scm_ArrayOps$ofRef.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_scm_ArrayOps$ofRef.prototype.repr__O = (function() {
  return this.repr$1
});
$c_scm_ArrayOps$ofRef.prototype.hashCode__I = (function() {
  var $$this = this.repr$1;
  return $$this.hashCode__I()
});
$c_scm_ArrayOps$ofRef.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_scm_ArrayOps$class__copyToArray__scm_ArrayOps__O__I__I__V(this, xs, start, len)
});
$c_scm_ArrayOps$ofRef.prototype.newBuilder__scm_Builder = (function() {
  var $$this = this.repr$1;
  var jsx$1 = $m_s_reflect_ClassTag$();
  var schematic = $objectGetClass($$this);
  return new $c_scm_ArrayBuilder$ofRef().init___s_reflect_ClassTag(jsx$1.apply__jl_Class__s_reflect_ClassTag(schematic.getComponentType__jl_Class()))
});
$c_scm_ArrayOps$ofRef.prototype.stringPrefix__T = (function() {
  return $s_sc_TraversableLike$class__stringPrefix__sc_TraversableLike__T(this)
});
function $is_scm_ArrayOps$ofRef(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ArrayOps$ofRef)))
}
function $as_scm_ArrayOps$ofRef(obj) {
  return (($is_scm_ArrayOps$ofRef(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ArrayOps$ofRef"))
}
function $isArrayOf_scm_ArrayOps$ofRef(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ArrayOps$ofRef)))
}
function $asArrayOf_scm_ArrayOps$ofRef(obj, depth) {
  return (($isArrayOf_scm_ArrayOps$ofRef(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ArrayOps$ofRef;", depth))
}
var $d_scm_ArrayOps$ofRef = new $TypeData().initClass({
  scm_ArrayOps$ofRef: 0
}, false, "scala.collection.mutable.ArrayOps$ofRef", {
  scm_ArrayOps$ofRef: 1,
  O: 1,
  scm_ArrayOps: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  scm_IndexedSeqLike: 1,
  sc_IndexedSeqLike: 1,
  sc_SeqLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenIterableLike: 1,
  sc_GenSeqLike: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1
});
$c_scm_ArrayOps$ofRef.prototype.$classData = $d_scm_ArrayOps$ofRef;
function $is_sc_Set(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_Set)))
}
function $as_sc_Set(obj) {
  return (($is_sc_Set(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.Set"))
}
function $isArrayOf_sc_Set(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_Set)))
}
function $asArrayOf_sc_Set(obj, depth) {
  return (($isArrayOf_sc_Set(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.Set;", depth))
}
/** @constructor */
function $c_scm_AbstractIterable() {
  $c_sc_AbstractIterable.call(this)
}
$c_scm_AbstractIterable.prototype = new $h_sc_AbstractIterable();
$c_scm_AbstractIterable.prototype.constructor = $c_scm_AbstractIterable;
/** @constructor */
function $h_scm_AbstractIterable() {
  /*<skip>*/
}
$h_scm_AbstractIterable.prototype = $c_scm_AbstractIterable.prototype;
function $is_sc_IndexedSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_IndexedSeq)))
}
function $as_sc_IndexedSeq(obj) {
  return (($is_sc_IndexedSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.IndexedSeq"))
}
function $isArrayOf_sc_IndexedSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_IndexedSeq)))
}
function $asArrayOf_sc_IndexedSeq(obj, depth) {
  return (($isArrayOf_sc_IndexedSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.IndexedSeq;", depth))
}
function $is_sc_LinearSeq(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sc_LinearSeq)))
}
function $as_sc_LinearSeq(obj) {
  return (($is_sc_LinearSeq(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.LinearSeq"))
}
function $isArrayOf_sc_LinearSeq(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sc_LinearSeq)))
}
function $asArrayOf_sc_LinearSeq(obj, depth) {
  return (($isArrayOf_sc_LinearSeq(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.LinearSeq;", depth))
}
/** @constructor */
function $c_sc_AbstractSeq() {
  $c_sc_AbstractIterable.call(this)
}
$c_sc_AbstractSeq.prototype = new $h_sc_AbstractIterable();
$c_sc_AbstractSeq.prototype.constructor = $c_sc_AbstractSeq;
/** @constructor */
function $h_sc_AbstractSeq() {
  /*<skip>*/
}
$h_sc_AbstractSeq.prototype = $c_sc_AbstractSeq.prototype;
$c_sc_AbstractSeq.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_SeqLike$class__lengthCompare__sc_SeqLike__I__I(this, len)
});
$c_sc_AbstractSeq.prototype.indices__sci_Range = (function() {
  return $s_sc_SeqLike$class__indices__sc_SeqLike__sci_Range(this)
});
$c_sc_AbstractSeq.prototype.isEmpty__Z = (function() {
  return $s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z(this)
});
$c_sc_AbstractSeq.prototype.equals__O__Z = (function(that) {
  return $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z(this, that)
});
$c_sc_AbstractSeq.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_sc_AbstractSeq.prototype.size__I = (function() {
  return this.length__I()
});
$c_sc_AbstractSeq.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this.seq__sc_Seq())
});
/** @constructor */
function $c_sc_AbstractMap() {
  $c_sc_AbstractIterable.call(this)
}
$c_sc_AbstractMap.prototype = new $h_sc_AbstractIterable();
$c_sc_AbstractMap.prototype.constructor = $c_sc_AbstractMap;
/** @constructor */
function $h_sc_AbstractMap() {
  /*<skip>*/
}
$h_sc_AbstractMap.prototype = $c_sc_AbstractMap.prototype;
$c_sc_AbstractMap.prototype.equals__O__Z = (function(that) {
  return $s_sc_GenMapLike$class__equals__sc_GenMapLike__O__Z(this, that)
});
$c_sc_AbstractMap.prototype.isEmpty__Z = (function() {
  return $s_sc_MapLike$class__isEmpty__sc_MapLike__Z(this)
});
$c_sc_AbstractMap.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_sc_AbstractMap.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  return $s_sc_MapLike$class__addString__sc_MapLike__scm_StringBuilder__T__T__T__scm_StringBuilder(this, b, start, sep, end)
});
$c_sc_AbstractMap.prototype.hashCode__I = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.unorderedHash__sc_TraversableOnce__I__I(this, this$1.mapSeed$2)
});
$c_sc_AbstractMap.prototype.stringPrefix__T = (function() {
  return "Map"
});
/** @constructor */
function $c_sc_AbstractSet() {
  $c_sc_AbstractIterable.call(this)
}
$c_sc_AbstractSet.prototype = new $h_sc_AbstractIterable();
$c_sc_AbstractSet.prototype.constructor = $c_sc_AbstractSet;
/** @constructor */
function $h_sc_AbstractSet() {
  /*<skip>*/
}
$h_sc_AbstractSet.prototype = $c_sc_AbstractSet.prototype;
$c_sc_AbstractSet.prototype.isEmpty__Z = (function() {
  return $s_sc_SetLike$class__isEmpty__sc_SetLike__Z(this)
});
$c_sc_AbstractSet.prototype.equals__O__Z = (function(that) {
  return $s_sc_GenSetLike$class__equals__sc_GenSetLike__O__Z(this, that)
});
$c_sc_AbstractSet.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_sc_AbstractSet.prototype.subsetOf__sc_GenSet__Z = (function(that) {
  return this.forall__F1__Z(that)
});
$c_sc_AbstractSet.prototype.hashCode__I = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.unorderedHash__sc_TraversableOnce__I__I(this, this$1.setSeed$2)
});
$c_sc_AbstractSet.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_SetBuilder().init___sc_Set(this.empty__sc_Set())
});
$c_sc_AbstractSet.prototype.stringPrefix__T = (function() {
  return "Set"
});
/** @constructor */
function $c_sci_ListSet() {
  $c_sc_AbstractSet.call(this)
}
$c_sci_ListSet.prototype = new $h_sc_AbstractSet();
$c_sci_ListSet.prototype.constructor = $c_sci_ListSet;
/** @constructor */
function $h_sci_ListSet() {
  /*<skip>*/
}
$h_sci_ListSet.prototype = $c_sci_ListSet.prototype;
$c_sci_ListSet.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_ListSet.prototype.head__O = (function() {
  throw new $c_ju_NoSuchElementException().init___T("Set has no elements")
});
$c_sci_ListSet.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_ListSet.prototype.isEmpty__Z = (function() {
  return true
});
$c_sci_ListSet.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_ListSet.prototype.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet = (function() {
  throw new $c_ju_NoSuchElementException().init___T("Empty ListSet has no outer pointer")
});
$c_sci_ListSet.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_ListSet$()
});
$c_sci_ListSet.prototype.$$plus__O__sci_ListSet = (function(elem) {
  return new $c_sci_ListSet$Node().init___sci_ListSet__O(this, elem)
});
$c_sci_ListSet.prototype.size__I = (function() {
  return 0
});
$c_sci_ListSet.prototype.iterator__sc_Iterator = (function() {
  return new $c_sci_ListSet$$anon$1().init___sci_ListSet(this)
});
$c_sci_ListSet.prototype.empty__sc_Set = (function() {
  return $m_sci_ListSet$EmptyListSet$()
});
$c_sci_ListSet.prototype.tail__O = (function() {
  return this.tail__sci_ListSet()
});
$c_sci_ListSet.prototype.contains__O__Z = (function(elem) {
  return false
});
$c_sci_ListSet.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_ListSet(elem)
});
$c_sci_ListSet.prototype.tail__sci_ListSet = (function() {
  throw new $c_ju_NoSuchElementException().init___T("Next of an empty set")
});
$c_sci_ListSet.prototype.stringPrefix__T = (function() {
  return "ListSet"
});
function $is_sci_ListSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_ListSet)))
}
function $as_sci_ListSet(obj) {
  return (($is_sci_ListSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.ListSet"))
}
function $isArrayOf_sci_ListSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_ListSet)))
}
function $asArrayOf_sci_ListSet(obj, depth) {
  return (($isArrayOf_sci_ListSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.ListSet;", depth))
}
/** @constructor */
function $c_sci_Set$EmptySet$() {
  $c_sc_AbstractSet.call(this)
}
$c_sci_Set$EmptySet$.prototype = new $h_sc_AbstractSet();
$c_sci_Set$EmptySet$.prototype.constructor = $c_sci_Set$EmptySet$;
/** @constructor */
function $h_sci_Set$EmptySet$() {
  /*<skip>*/
}
$h_sci_Set$EmptySet$.prototype = $c_sci_Set$EmptySet$.prototype;
$c_sci_Set$EmptySet$.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$EmptySet$.prototype.init___ = (function() {
  return this
});
$c_sci_Set$EmptySet$.prototype.apply__O__O = (function(v1) {
  return false
});
$c_sci_Set$EmptySet$.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$EmptySet$.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$EmptySet$.prototype.foreach__F1__V = (function(f) {
  /*<skip>*/
});
$c_sci_Set$EmptySet$.prototype.size__I = (function() {
  return 0
});
$c_sci_Set$EmptySet$.prototype.iterator__sc_Iterator = (function() {
  return $m_sc_Iterator$().empty$1
});
$c_sci_Set$EmptySet$.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$EmptySet$.prototype.$$plus__O__sc_Set = (function(elem) {
  return new $c_sci_Set$Set1().init___O(elem)
});
var $d_sci_Set$EmptySet$ = new $TypeData().initClass({
  sci_Set$EmptySet$: 0
}, false, "scala.collection.immutable.Set$EmptySet$", {
  sci_Set$EmptySet$: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$EmptySet$.prototype.$classData = $d_sci_Set$EmptySet$;
var $n_sci_Set$EmptySet$ = (void 0);
function $m_sci_Set$EmptySet$() {
  if ((!$n_sci_Set$EmptySet$)) {
    $n_sci_Set$EmptySet$ = new $c_sci_Set$EmptySet$().init___()
  };
  return $n_sci_Set$EmptySet$
}
/** @constructor */
function $c_sci_Set$Set1() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null
}
$c_sci_Set$Set1.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set1.prototype.constructor = $c_sci_Set$Set1;
/** @constructor */
function $h_sci_Set$Set1() {
  /*<skip>*/
}
$h_sci_Set$Set1.prototype = $c_sci_Set$Set1.prototype;
$c_sci_Set$Set1.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set1.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set1.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set1.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set1.prototype.forall__F1__Z = (function(p) {
  return $uZ(p.apply__O__O(this.elem1$4))
});
$c_sci_Set$Set1.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4)
});
$c_sci_Set$Set1.prototype.size__I = (function() {
  return 1
});
$c_sci_Set$Set1.prototype.init___O = (function(elem1) {
  this.elem1$4 = elem1;
  return this
});
$c_sci_Set$Set1.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6.length))
});
$c_sci_Set$Set1.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set1.prototype.$$plus__O__sci_Set = (function(elem) {
  return (this.contains__O__Z(elem) ? this : new $c_sci_Set$Set2().init___O__O(this.elem1$4, elem))
});
$c_sci_Set$Set1.prototype.contains__O__Z = (function(elem) {
  return $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4)
});
$c_sci_Set$Set1.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set1 = new $TypeData().initClass({
  sci_Set$Set1: 0
}, false, "scala.collection.immutable.Set$Set1", {
  sci_Set$Set1: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set1.prototype.$classData = $d_sci_Set$Set1;
/** @constructor */
function $c_sci_Set$Set2() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null;
  this.elem2$4 = null
}
$c_sci_Set$Set2.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set2.prototype.constructor = $c_sci_Set$Set2;
/** @constructor */
function $h_sci_Set$Set2() {
  /*<skip>*/
}
$h_sci_Set$Set2.prototype = $c_sci_Set$Set2.prototype;
$c_sci_Set$Set2.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set2.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set2.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set2.prototype.init___O__O = (function(elem1, elem2) {
  this.elem1$4 = elem1;
  this.elem2$4 = elem2;
  return this
});
$c_sci_Set$Set2.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set2.prototype.forall__F1__Z = (function(p) {
  return ($uZ(p.apply__O__O(this.elem1$4)) && $uZ(p.apply__O__O(this.elem2$4)))
});
$c_sci_Set$Set2.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4);
  f.apply__O__O(this.elem2$4)
});
$c_sci_Set$Set2.prototype.size__I = (function() {
  return 2
});
$c_sci_Set$Set2.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4, this.elem2$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6.length))
});
$c_sci_Set$Set2.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set2.prototype.$$plus__O__sci_Set = (function(elem) {
  return (this.contains__O__Z(elem) ? this : new $c_sci_Set$Set3().init___O__O__O(this.elem1$4, this.elem2$4, elem))
});
$c_sci_Set$Set2.prototype.contains__O__Z = (function(elem) {
  return ($m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem2$4))
});
$c_sci_Set$Set2.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set2 = new $TypeData().initClass({
  sci_Set$Set2: 0
}, false, "scala.collection.immutable.Set$Set2", {
  sci_Set$Set2: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set2.prototype.$classData = $d_sci_Set$Set2;
/** @constructor */
function $c_sci_Set$Set3() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null;
  this.elem2$4 = null;
  this.elem3$4 = null
}
$c_sci_Set$Set3.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set3.prototype.constructor = $c_sci_Set$Set3;
/** @constructor */
function $h_sci_Set$Set3() {
  /*<skip>*/
}
$h_sci_Set$Set3.prototype = $c_sci_Set$Set3.prototype;
$c_sci_Set$Set3.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set3.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set3.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set3.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set3.prototype.forall__F1__Z = (function(p) {
  return (($uZ(p.apply__O__O(this.elem1$4)) && $uZ(p.apply__O__O(this.elem2$4))) && $uZ(p.apply__O__O(this.elem3$4)))
});
$c_sci_Set$Set3.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4);
  f.apply__O__O(this.elem2$4);
  f.apply__O__O(this.elem3$4)
});
$c_sci_Set$Set3.prototype.init___O__O__O = (function(elem1, elem2, elem3) {
  this.elem1$4 = elem1;
  this.elem2$4 = elem2;
  this.elem3$4 = elem3;
  return this
});
$c_sci_Set$Set3.prototype.size__I = (function() {
  return 3
});
$c_sci_Set$Set3.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4, this.elem2$4, this.elem3$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6.length))
});
$c_sci_Set$Set3.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set3.prototype.$$plus__O__sci_Set = (function(elem) {
  return (this.contains__O__Z(elem) ? this : new $c_sci_Set$Set4().init___O__O__O__O(this.elem1$4, this.elem2$4, this.elem3$4, elem))
});
$c_sci_Set$Set3.prototype.contains__O__Z = (function(elem) {
  return (($m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem2$4)) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem3$4))
});
$c_sci_Set$Set3.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set3 = new $TypeData().initClass({
  sci_Set$Set3: 0
}, false, "scala.collection.immutable.Set$Set3", {
  sci_Set$Set3: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set3.prototype.$classData = $d_sci_Set$Set3;
/** @constructor */
function $c_sci_Set$Set4() {
  $c_sc_AbstractSet.call(this);
  this.elem1$4 = null;
  this.elem2$4 = null;
  this.elem3$4 = null;
  this.elem4$4 = null
}
$c_sci_Set$Set4.prototype = new $h_sc_AbstractSet();
$c_sci_Set$Set4.prototype.constructor = $c_sci_Set$Set4;
/** @constructor */
function $h_sci_Set$Set4() {
  /*<skip>*/
}
$h_sci_Set$Set4.prototype = $c_sci_Set$Set4.prototype;
$c_sci_Set$Set4.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Set$Set4.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_Set$Set4.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Set$Set4.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Set$()
});
$c_sci_Set$Set4.prototype.forall__F1__Z = (function(p) {
  return ((($uZ(p.apply__O__O(this.elem1$4)) && $uZ(p.apply__O__O(this.elem2$4))) && $uZ(p.apply__O__O(this.elem3$4))) && $uZ(p.apply__O__O(this.elem4$4)))
});
$c_sci_Set$Set4.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.elem1$4);
  f.apply__O__O(this.elem2$4);
  f.apply__O__O(this.elem3$4);
  f.apply__O__O(this.elem4$4)
});
$c_sci_Set$Set4.prototype.size__I = (function() {
  return 4
});
$c_sci_Set$Set4.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.elem1$4, this.elem2$4, this.elem3$4, this.elem4$4]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6.length))
});
$c_sci_Set$Set4.prototype.empty__sc_Set = (function() {
  return $m_sci_Set$EmptySet$()
});
$c_sci_Set$Set4.prototype.$$plus__O__sci_Set = (function(elem) {
  if (this.contains__O__Z(elem)) {
    return this
  } else {
    var this$1 = new $c_sci_HashSet().init___();
    var elem1 = this.elem1$4;
    var elem2 = this.elem2$4;
    var array = [this.elem3$4, this.elem4$4, elem];
    var this$2 = this$1.$$plus__O__sci_HashSet(elem1).$$plus__O__sci_HashSet(elem2);
    var start = 0;
    var end = $uI(array.length);
    var z = this$2;
    var jsx$1;
    _foldl: while (true) {
      if ((start !== end)) {
        var temp$start = ((1 + start) | 0);
        var arg1 = z;
        var index = start;
        var arg2 = array[index];
        var x$2 = $as_sc_Set(arg1);
        var temp$z = x$2.$$plus__O__sc_Set(arg2);
        start = temp$start;
        z = temp$z;
        continue _foldl
      };
      var jsx$1 = z;
      break
    };
    return $as_sci_HashSet($as_sc_Set(jsx$1))
  }
});
$c_sci_Set$Set4.prototype.contains__O__Z = (function(elem) {
  return ((($m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem1$4) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem2$4)) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem3$4)) || $m_sr_BoxesRunTime$().equals__O__O__Z(elem, this.elem4$4))
});
$c_sci_Set$Set4.prototype.init___O__O__O__O = (function(elem1, elem2, elem3, elem4) {
  this.elem1$4 = elem1;
  this.elem2$4 = elem2;
  this.elem3$4 = elem3;
  this.elem4$4 = elem4;
  return this
});
$c_sci_Set$Set4.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_Set(elem)
});
var $d_sci_Set$Set4 = new $TypeData().initClass({
  sci_Set$Set4: 0
}, false, "scala.collection.immutable.Set$Set4", {
  sci_Set$Set4: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Set$Set4.prototype.$classData = $d_sci_Set$Set4;
/** @constructor */
function $c_sci_HashSet() {
  $c_sc_AbstractSet.call(this)
}
$c_sci_HashSet.prototype = new $h_sc_AbstractSet();
$c_sci_HashSet.prototype.constructor = $c_sci_HashSet;
/** @constructor */
function $h_sci_HashSet() {
  /*<skip>*/
}
$h_sci_HashSet.prototype = $c_sci_HashSet.prototype;
$c_sci_HashSet.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_HashSet.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  return new $c_sci_HashSet$HashSet1().init___O__I(key, hash)
});
$c_sci_HashSet.prototype.computeHash__O__I = (function(key) {
  return this.improve__I__I($m_sr_ScalaRunTime$().hash__O__I(key))
});
$c_sci_HashSet.prototype.init___ = (function() {
  return this
});
$c_sci_HashSet.prototype.apply__O__O = (function(v1) {
  return this.contains__O__Z(v1)
});
$c_sci_HashSet.prototype.$$plus__O__sci_HashSet = (function(e) {
  return this.updated0__O__I__I__sci_HashSet(e, this.computeHash__O__I(e), 0)
});
$c_sci_HashSet.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_HashSet.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_HashSet$()
});
$c_sci_HashSet.prototype.foreach__F1__V = (function(f) {
  /*<skip>*/
});
$c_sci_HashSet.prototype.subsetOf__sc_GenSet__Z = (function(that) {
  if ($is_sci_HashSet(that)) {
    var x2 = $as_sci_HashSet(that);
    return this.subsetOf0__sci_HashSet__I__Z(x2, 0)
  } else {
    var this$1 = this.iterator__sc_Iterator();
    return $s_sc_Iterator$class__forall__sc_Iterator__F1__Z(this$1, that)
  }
});
$c_sci_HashSet.prototype.size__I = (function() {
  return 0
});
$c_sci_HashSet.prototype.iterator__sc_Iterator = (function() {
  return $m_sc_Iterator$().empty$1
});
$c_sci_HashSet.prototype.empty__sc_Set = (function() {
  return $m_sci_HashSet$EmptyHashSet$()
});
$c_sci_HashSet.prototype.improve__I__I = (function(hcode) {
  var h = ((hcode + (~(hcode << 9))) | 0);
  h = (h ^ ((h >>> 14) | 0));
  h = ((h + (h << 4)) | 0);
  return (h ^ ((h >>> 10) | 0))
});
$c_sci_HashSet.prototype.contains__O__Z = (function(e) {
  return this.get0__O__I__I__Z(e, this.computeHash__O__I(e), 0)
});
$c_sci_HashSet.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_HashSet(elem)
});
$c_sci_HashSet.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  return false
});
$c_sci_HashSet.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  return true
});
function $is_sci_HashSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashSet)))
}
function $as_sci_HashSet(obj) {
  return (($is_sci_HashSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashSet"))
}
function $isArrayOf_sci_HashSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashSet)))
}
function $asArrayOf_sci_HashSet(obj, depth) {
  return (($isArrayOf_sci_HashSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashSet;", depth))
}
var $d_sci_HashSet = new $TypeData().initClass({
  sci_HashSet: 0
}, false, "scala.collection.immutable.HashSet", {
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet.prototype.$classData = $d_sci_HashSet;
/** @constructor */
function $c_sci_ListSet$EmptyListSet$() {
  $c_sci_ListSet.call(this)
}
$c_sci_ListSet$EmptyListSet$.prototype = new $h_sci_ListSet();
$c_sci_ListSet$EmptyListSet$.prototype.constructor = $c_sci_ListSet$EmptyListSet$;
/** @constructor */
function $h_sci_ListSet$EmptyListSet$() {
  /*<skip>*/
}
$h_sci_ListSet$EmptyListSet$.prototype = $c_sci_ListSet$EmptyListSet$.prototype;
$c_sci_ListSet$EmptyListSet$.prototype.init___ = (function() {
  return this
});
var $d_sci_ListSet$EmptyListSet$ = new $TypeData().initClass({
  sci_ListSet$EmptyListSet$: 0
}, false, "scala.collection.immutable.ListSet$EmptyListSet$", {
  sci_ListSet$EmptyListSet$: 1,
  sci_ListSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_ListSet$EmptyListSet$.prototype.$classData = $d_sci_ListSet$EmptyListSet$;
var $n_sci_ListSet$EmptyListSet$ = (void 0);
function $m_sci_ListSet$EmptyListSet$() {
  if ((!$n_sci_ListSet$EmptyListSet$)) {
    $n_sci_ListSet$EmptyListSet$ = new $c_sci_ListSet$EmptyListSet$().init___()
  };
  return $n_sci_ListSet$EmptyListSet$
}
/** @constructor */
function $c_sci_ListSet$Node() {
  $c_sci_ListSet.call(this);
  this.head$5 = null;
  this.$$outer$f = null
}
$c_sci_ListSet$Node.prototype = new $h_sci_ListSet();
$c_sci_ListSet$Node.prototype.constructor = $c_sci_ListSet$Node;
/** @constructor */
function $h_sci_ListSet$Node() {
  /*<skip>*/
}
$h_sci_ListSet$Node.prototype = $c_sci_ListSet$Node.prototype;
$c_sci_ListSet$Node.prototype.head__O = (function() {
  return this.head$5
});
$c_sci_ListSet$Node.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_ListSet$Node.prototype.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet = (function() {
  return this.$$outer$f
});
$c_sci_ListSet$Node.prototype.$$plus__O__sci_ListSet = (function(e) {
  return (this.containsInternal__p5__sci_ListSet__O__Z(this, e) ? this : new $c_sci_ListSet$Node().init___sci_ListSet__O(this, e))
});
$c_sci_ListSet$Node.prototype.sizeInternal__p5__sci_ListSet__I__I = (function(n, acc) {
  _sizeInternal: while (true) {
    if (n.isEmpty__Z()) {
      return acc
    } else {
      var temp$n = n.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet();
      var temp$acc = ((1 + acc) | 0);
      n = temp$n;
      acc = temp$acc;
      continue _sizeInternal
    }
  }
});
$c_sci_ListSet$Node.prototype.size__I = (function() {
  return this.sizeInternal__p5__sci_ListSet__I__I(this, 0)
});
$c_sci_ListSet$Node.prototype.init___sci_ListSet__O = (function($$outer, head) {
  this.head$5 = head;
  if (($$outer === null)) {
    throw $m_sjsr_package$().unwrapJavaScriptException__jl_Throwable__O(null)
  } else {
    this.$$outer$f = $$outer
  };
  return this
});
$c_sci_ListSet$Node.prototype.contains__O__Z = (function(e) {
  return this.containsInternal__p5__sci_ListSet__O__Z(this, e)
});
$c_sci_ListSet$Node.prototype.tail__O = (function() {
  return this.$$outer$f
});
$c_sci_ListSet$Node.prototype.containsInternal__p5__sci_ListSet__O__Z = (function(n, e) {
  _containsInternal: while (true) {
    if ((!n.isEmpty__Z())) {
      if ($m_sr_BoxesRunTime$().equals__O__O__Z(n.head__O(), e)) {
        return true
      } else {
        n = n.scala$collection$immutable$ListSet$$unchecked$undouter__sci_ListSet();
        continue _containsInternal
      }
    } else {
      return false
    }
  }
});
$c_sci_ListSet$Node.prototype.tail__sci_ListSet = (function() {
  return this.$$outer$f
});
$c_sci_ListSet$Node.prototype.$$plus__O__sc_Set = (function(elem) {
  return this.$$plus__O__sci_ListSet(elem)
});
var $d_sci_ListSet$Node = new $TypeData().initClass({
  sci_ListSet$Node: 0
}, false, "scala.collection.immutable.ListSet$Node", {
  sci_ListSet$Node: 1,
  sci_ListSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_ListSet$Node.prototype.$classData = $d_sci_ListSet$Node;
/** @constructor */
function $c_scm_AbstractSeq() {
  $c_sc_AbstractSeq.call(this)
}
$c_scm_AbstractSeq.prototype = new $h_sc_AbstractSeq();
$c_scm_AbstractSeq.prototype.constructor = $c_scm_AbstractSeq;
/** @constructor */
function $h_scm_AbstractSeq() {
  /*<skip>*/
}
$h_scm_AbstractSeq.prototype = $c_scm_AbstractSeq.prototype;
$c_scm_AbstractSeq.prototype.seq__sc_TraversableOnce = (function() {
  return this.seq__scm_Seq()
});
$c_scm_AbstractSeq.prototype.seq__scm_Seq = (function() {
  return this
});
/** @constructor */
function $c_sci_HashSet$EmptyHashSet$() {
  $c_sci_HashSet.call(this)
}
$c_sci_HashSet$EmptyHashSet$.prototype = new $h_sci_HashSet();
$c_sci_HashSet$EmptyHashSet$.prototype.constructor = $c_sci_HashSet$EmptyHashSet$;
/** @constructor */
function $h_sci_HashSet$EmptyHashSet$() {
  /*<skip>*/
}
$h_sci_HashSet$EmptyHashSet$.prototype = $c_sci_HashSet$EmptyHashSet$.prototype;
$c_sci_HashSet$EmptyHashSet$.prototype.init___ = (function() {
  return this
});
var $d_sci_HashSet$EmptyHashSet$ = new $TypeData().initClass({
  sci_HashSet$EmptyHashSet$: 0
}, false, "scala.collection.immutable.HashSet$EmptyHashSet$", {
  sci_HashSet$EmptyHashSet$: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$EmptyHashSet$.prototype.$classData = $d_sci_HashSet$EmptyHashSet$;
var $n_sci_HashSet$EmptyHashSet$ = (void 0);
function $m_sci_HashSet$EmptyHashSet$() {
  if ((!$n_sci_HashSet$EmptyHashSet$)) {
    $n_sci_HashSet$EmptyHashSet$ = new $c_sci_HashSet$EmptyHashSet$().init___()
  };
  return $n_sci_HashSet$EmptyHashSet$
}
/** @constructor */
function $c_sci_HashSet$HashTrieSet() {
  $c_sci_HashSet.call(this);
  this.bitmap$5 = 0;
  this.elems$5 = null;
  this.size0$5 = 0
}
$c_sci_HashSet$HashTrieSet.prototype = new $h_sci_HashSet();
$c_sci_HashSet$HashTrieSet.prototype.constructor = $c_sci_HashSet$HashTrieSet;
/** @constructor */
function $h_sci_HashSet$HashTrieSet() {
  /*<skip>*/
}
$h_sci_HashSet$HashTrieSet.prototype = $c_sci_HashSet$HashTrieSet.prototype;
$c_sci_HashSet$HashTrieSet.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  var index = (31 & ((hash >>> level) | 0));
  var mask = (1 << index);
  var offset = $m_jl_Integer$().bitCount__I__I((this.bitmap$5 & (((-1) + mask) | 0)));
  if (((this.bitmap$5 & mask) !== 0)) {
    var sub = this.elems$5.u[offset];
    var subNew = sub.updated0__O__I__I__sci_HashSet(key, hash, ((5 + level) | 0));
    if ((sub === subNew)) {
      return this
    } else {
      var elemsNew = $newArrayObject($d_sci_HashSet.getArrayOf(), [this.elems$5.u.length]);
      $m_s_Array$().copy__O__I__O__I__I__V(this.elems$5, 0, elemsNew, 0, this.elems$5.u.length);
      elemsNew.u[offset] = subNew;
      return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(this.bitmap$5, elemsNew, ((this.size0$5 + ((subNew.size__I() - sub.size__I()) | 0)) | 0))
    }
  } else {
    var elemsNew$2 = $newArrayObject($d_sci_HashSet.getArrayOf(), [((1 + this.elems$5.u.length) | 0)]);
    $m_s_Array$().copy__O__I__O__I__I__V(this.elems$5, 0, elemsNew$2, 0, offset);
    elemsNew$2.u[offset] = new $c_sci_HashSet$HashSet1().init___O__I(key, hash);
    $m_s_Array$().copy__O__I__O__I__I__V(this.elems$5, offset, elemsNew$2, ((1 + offset) | 0), ((this.elems$5.u.length - offset) | 0));
    var bitmapNew = (this.bitmap$5 | mask);
    return new $c_sci_HashSet$HashTrieSet().init___I__Asci_HashSet__I(bitmapNew, elemsNew$2, ((1 + this.size0$5) | 0))
  }
});
$c_sci_HashSet$HashTrieSet.prototype.foreach__F1__V = (function(f) {
  var i = 0;
  while ((i < this.elems$5.u.length)) {
    this.elems$5.u[i].foreach__F1__V(f);
    i = ((1 + i) | 0)
  }
});
$c_sci_HashSet$HashTrieSet.prototype.iterator__sc_Iterator = (function() {
  return new $c_sci_HashSet$HashTrieSet$$anon$1().init___sci_HashSet$HashTrieSet(this)
});
$c_sci_HashSet$HashTrieSet.prototype.size__I = (function() {
  return this.size0$5
});
$c_sci_HashSet$HashTrieSet.prototype.init___I__Asci_HashSet__I = (function(bitmap, elems, size0) {
  this.bitmap$5 = bitmap;
  this.elems$5 = elems;
  this.size0$5 = size0;
  $m_s_Predef$().assert__Z__V(($m_jl_Integer$().bitCount__I__I(bitmap) === elems.u.length));
  return this
});
$c_sci_HashSet$HashTrieSet.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  var index = (31 & ((hash >>> level) | 0));
  var mask = (1 << index);
  if ((this.bitmap$5 === (-1))) {
    return this.elems$5.u[(31 & index)].get0__O__I__I__Z(key, hash, ((5 + level) | 0))
  } else if (((this.bitmap$5 & mask) !== 0)) {
    var offset = $m_jl_Integer$().bitCount__I__I((this.bitmap$5 & (((-1) + mask) | 0)));
    return this.elems$5.u[offset].get0__O__I__I__Z(key, hash, ((5 + level) | 0))
  } else {
    return false
  }
});
$c_sci_HashSet$HashTrieSet.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  if ((that === this)) {
    return true
  } else {
    if ($is_sci_HashSet$HashTrieSet(that)) {
      var x2 = $as_sci_HashSet$HashTrieSet(that);
      if ((this.size0$5 <= x2.size0$5)) {
        var abm = this.bitmap$5;
        var a = this.elems$5;
        var ai = 0;
        var b = x2.elems$5;
        var bbm = x2.bitmap$5;
        var bi = 0;
        if (((abm & bbm) === abm)) {
          while ((abm !== 0)) {
            var alsb = (abm ^ (abm & (((-1) + abm) | 0)));
            var blsb = (bbm ^ (bbm & (((-1) + bbm) | 0)));
            if ((alsb === blsb)) {
              if ((!a.u[ai].subsetOf0__sci_HashSet__I__Z(b.u[bi], ((5 + level) | 0)))) {
                return false
              };
              abm = (abm & (~alsb));
              ai = ((1 + ai) | 0)
            };
            bbm = (bbm & (~blsb));
            bi = ((1 + bi) | 0)
          };
          return true
        } else {
          return false
        }
      }
    };
    return false
  }
});
function $is_sci_HashSet$HashTrieSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashSet$HashTrieSet)))
}
function $as_sci_HashSet$HashTrieSet(obj) {
  return (($is_sci_HashSet$HashTrieSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashSet$HashTrieSet"))
}
function $isArrayOf_sci_HashSet$HashTrieSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashSet$HashTrieSet)))
}
function $asArrayOf_sci_HashSet$HashTrieSet(obj, depth) {
  return (($isArrayOf_sci_HashSet$HashTrieSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashSet$HashTrieSet;", depth))
}
var $d_sci_HashSet$HashTrieSet = new $TypeData().initClass({
  sci_HashSet$HashTrieSet: 0
}, false, "scala.collection.immutable.HashSet$HashTrieSet", {
  sci_HashSet$HashTrieSet: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$HashTrieSet.prototype.$classData = $d_sci_HashSet$HashTrieSet;
/** @constructor */
function $c_sci_HashSet$LeafHashSet() {
  $c_sci_HashSet.call(this)
}
$c_sci_HashSet$LeafHashSet.prototype = new $h_sci_HashSet();
$c_sci_HashSet$LeafHashSet.prototype.constructor = $c_sci_HashSet$LeafHashSet;
/** @constructor */
function $h_sci_HashSet$LeafHashSet() {
  /*<skip>*/
}
$h_sci_HashSet$LeafHashSet.prototype = $c_sci_HashSet$LeafHashSet.prototype;
/** @constructor */
function $c_sci_HashSet$HashSet1() {
  $c_sci_HashSet$LeafHashSet.call(this);
  this.key$6 = null;
  this.hash$6 = 0
}
$c_sci_HashSet$HashSet1.prototype = new $h_sci_HashSet$LeafHashSet();
$c_sci_HashSet$HashSet1.prototype.constructor = $c_sci_HashSet$HashSet1;
/** @constructor */
function $h_sci_HashSet$HashSet1() {
  /*<skip>*/
}
$h_sci_HashSet$HashSet1.prototype = $c_sci_HashSet$HashSet1.prototype;
$c_sci_HashSet$HashSet1.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  if (((hash === this.hash$6) && $m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key$6))) {
    return this
  } else if ((hash !== this.hash$6)) {
    return $m_sci_HashSet$().scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet(this.hash$6, this, hash, new $c_sci_HashSet$HashSet1().init___O__I(key, hash), level)
  } else {
    var this$2 = $m_sci_ListSet$EmptyListSet$();
    var elem = this.key$6;
    return new $c_sci_HashSet$HashSetCollision1().init___I__sci_ListSet(hash, new $c_sci_ListSet$Node().init___sci_ListSet__O(this$2, elem).$$plus__O__sci_ListSet(key))
  }
});
$c_sci_HashSet$HashSet1.prototype.init___O__I = (function(key, hash) {
  this.key$6 = key;
  this.hash$6 = hash;
  return this
});
$c_sci_HashSet$HashSet1.prototype.foreach__F1__V = (function(f) {
  f.apply__O__O(this.key$6)
});
$c_sci_HashSet$HashSet1.prototype.iterator__sc_Iterator = (function() {
  $m_sc_Iterator$();
  var elems = new $c_sjs_js_WrappedArray().init___sjs_js_Array([this.key$6]);
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(elems, 0, $uI(elems.array$6.length))
});
$c_sci_HashSet$HashSet1.prototype.size__I = (function() {
  return 1
});
$c_sci_HashSet$HashSet1.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  return ((hash === this.hash$6) && $m_sr_BoxesRunTime$().equals__O__O__Z(key, this.key$6))
});
$c_sci_HashSet$HashSet1.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  return that.get0__O__I__I__Z(this.key$6, this.hash$6, level)
});
function $is_sci_HashSet$HashSet1(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashSet$HashSet1)))
}
function $as_sci_HashSet$HashSet1(obj) {
  return (($is_sci_HashSet$HashSet1(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashSet$HashSet1"))
}
function $isArrayOf_sci_HashSet$HashSet1(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashSet$HashSet1)))
}
function $asArrayOf_sci_HashSet$HashSet1(obj, depth) {
  return (($isArrayOf_sci_HashSet$HashSet1(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashSet$HashSet1;", depth))
}
var $d_sci_HashSet$HashSet1 = new $TypeData().initClass({
  sci_HashSet$HashSet1: 0
}, false, "scala.collection.immutable.HashSet$HashSet1", {
  sci_HashSet$HashSet1: 1,
  sci_HashSet$LeafHashSet: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$HashSet1.prototype.$classData = $d_sci_HashSet$HashSet1;
/** @constructor */
function $c_sci_HashSet$HashSetCollision1() {
  $c_sci_HashSet$LeafHashSet.call(this);
  this.hash$6 = 0;
  this.ks$6 = null
}
$c_sci_HashSet$HashSetCollision1.prototype = new $h_sci_HashSet$LeafHashSet();
$c_sci_HashSet$HashSetCollision1.prototype.constructor = $c_sci_HashSet$HashSetCollision1;
/** @constructor */
function $h_sci_HashSet$HashSetCollision1() {
  /*<skip>*/
}
$h_sci_HashSet$HashSetCollision1.prototype = $c_sci_HashSet$HashSetCollision1.prototype;
$c_sci_HashSet$HashSetCollision1.prototype.updated0__O__I__I__sci_HashSet = (function(key, hash, level) {
  return ((hash === this.hash$6) ? new $c_sci_HashSet$HashSetCollision1().init___I__sci_ListSet(hash, this.ks$6.$$plus__O__sci_ListSet(key)) : $m_sci_HashSet$().scala$collection$immutable$HashSet$$makeHashTrieSet__I__sci_HashSet__I__sci_HashSet__I__sci_HashSet$HashTrieSet(this.hash$6, this, hash, new $c_sci_HashSet$HashSet1().init___O__I(key, hash), level))
});
$c_sci_HashSet$HashSetCollision1.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.ks$6;
  var this$2 = new $c_sci_ListSet$$anon$1().init___sci_ListSet(this$1);
  $s_sc_Iterator$class__foreach__sc_Iterator__F1__V(this$2, f)
});
$c_sci_HashSet$HashSetCollision1.prototype.iterator__sc_Iterator = (function() {
  var this$1 = this.ks$6;
  return new $c_sci_ListSet$$anon$1().init___sci_ListSet(this$1)
});
$c_sci_HashSet$HashSetCollision1.prototype.size__I = (function() {
  return this.ks$6.size__I()
});
$c_sci_HashSet$HashSetCollision1.prototype.init___I__sci_ListSet = (function(hash, ks) {
  this.hash$6 = hash;
  this.ks$6 = ks;
  return this
});
$c_sci_HashSet$HashSetCollision1.prototype.get0__O__I__I__Z = (function(key, hash, level) {
  return ((hash === this.hash$6) && this.ks$6.contains__O__Z(key))
});
$c_sci_HashSet$HashSetCollision1.prototype.subsetOf0__sci_HashSet__I__Z = (function(that, level) {
  var this$1 = this.ks$6;
  var this$2 = new $c_sci_ListSet$$anon$1().init___sci_ListSet(this$1);
  var res = true;
  while (true) {
    if (res) {
      var this$3 = this$2.that$2;
      var jsx$1 = $s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$3)
    } else {
      var jsx$1 = false
    };
    if (jsx$1) {
      var arg1 = this$2.next__O();
      res = that.get0__O__I__I__Z(arg1, this.hash$6, level)
    } else {
      break
    }
  };
  return res
});
var $d_sci_HashSet$HashSetCollision1 = new $TypeData().initClass({
  sci_HashSet$HashSetCollision1: 0
}, false, "scala.collection.immutable.HashSet$HashSetCollision1", {
  sci_HashSet$HashSetCollision1: 1,
  sci_HashSet$LeafHashSet: 1,
  sci_HashSet: 1,
  sc_AbstractSet: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  sci_Set: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_HashSet$HashSetCollision1.prototype.$classData = $d_sci_HashSet$HashSetCollision1;
/** @constructor */
function $c_sci_List() {
  $c_sc_AbstractSeq.call(this)
}
$c_sci_List.prototype = new $h_sc_AbstractSeq();
$c_sci_List.prototype.constructor = $c_sci_List;
/** @constructor */
function $h_sci_List() {
  /*<skip>*/
}
$h_sci_List.prototype = $c_sci_List.prototype;
$c_sci_List.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_List.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I(this, len)
});
$c_sci_List.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_List.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this, n)
});
$c_sci_List.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_List.prototype.drop__I__sc_LinearSeqOptimized = (function(n) {
  return this.drop__I__sci_List(n)
});
$c_sci_List.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_List$()
});
$c_sci_List.prototype.foreach__F1__V = (function(f) {
  var these = this;
  while ((!these.isEmpty__Z())) {
    f.apply__O__O(these.head__O());
    these = $as_sci_List(these.tail__O())
  }
});
$c_sci_List.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_LinearSeqLike$$anon$1().init___sc_LinearSeqLike(this)
});
$c_sci_List.prototype.drop__I__sci_List = (function(n) {
  var these = this;
  var count = n;
  while (((!these.isEmpty__Z()) && (count > 0))) {
    these = $as_sci_List(these.tail__O());
    count = (((-1) + count) | 0)
  };
  return these
});
$c_sci_List.prototype.length__I = (function() {
  return $s_sc_LinearSeqOptimized$class__length__sc_LinearSeqOptimized__I(this)
});
$c_sci_List.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_List.prototype.toStream__sci_Stream = (function() {
  return (this.isEmpty__Z() ? $m_sci_Stream$Empty$() : new $c_sci_Stream$Cons().init___O__F0(this.head__O(), new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this) {
    return (function() {
      return $as_sci_List($this.tail__O()).toStream__sci_Stream()
    })
  })(this))))
});
$c_sci_List.prototype.drop__I__O = (function(n) {
  return this.drop__I__sci_List(n)
});
$c_sci_List.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_List.prototype.stringPrefix__T = (function() {
  return "List"
});
function $is_sci_List(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_List)))
}
function $as_sci_List(obj) {
  return (($is_sci_List(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.List"))
}
function $isArrayOf_sci_List(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_List)))
}
function $asArrayOf_sci_List(obj, depth) {
  return (($isArrayOf_sci_List(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.List;", depth))
}
/** @constructor */
function $c_sci_Range() {
  $c_sc_AbstractSeq.call(this);
  this.start$4 = 0;
  this.end$4 = 0;
  this.step$4 = 0;
  this.isEmpty$4 = false;
  this.numRangeElements$4 = 0;
  this.lastElement$4 = 0;
  this.terminalElement$4 = 0
}
$c_sci_Range.prototype = new $h_sc_AbstractSeq();
$c_sci_Range.prototype.constructor = $c_sci_Range;
/** @constructor */
function $h_sci_Range() {
  /*<skip>*/
}
$h_sci_Range.prototype = $c_sci_Range.prototype;
$c_sci_Range.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Range.prototype.isInclusive__Z = (function() {
  return false
});
$c_sci_Range.prototype.head__O = (function() {
  return this.head__I()
});
$c_sci_Range.prototype.apply__I__O = (function(idx) {
  return this.apply$mcII$sp__I__I(idx)
});
$c_sci_Range.prototype.apply__O__O = (function(v1) {
  var idx = $uI(v1);
  return this.apply$mcII$sp__I__I(idx)
});
$c_sci_Range.prototype.isEmpty__Z = (function() {
  return this.isEmpty$4
});
$c_sci_Range.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Range.prototype.longLength__p4__J = (function() {
  var t = this.gap__p4__J();
  var lo = t.lo$2;
  var hi$1 = t.hi$2;
  var value = this.step$4;
  var hi = (value >> 31);
  var this$1 = $m_sjsr_RuntimeLong$();
  var lo$1 = this$1.divideImpl__I__I__I__I__I(lo, hi$1, value, hi);
  var hi$2 = this$1.scala$scalajs$runtime$RuntimeLong$$hiReturn$f;
  var value$1 = (this.hasStub__p4__Z() ? 1 : 0);
  var hi$3 = (value$1 >> 31);
  var lo$2 = ((lo$1 + value$1) | 0);
  var hi$4 = ((((-2147483648) ^ lo$2) < ((-2147483648) ^ lo$1)) ? ((1 + ((hi$2 + hi$3) | 0)) | 0) : ((hi$2 + hi$3) | 0));
  return new $c_sjsr_RuntimeLong().init___I__I(lo$2, hi$4)
});
$c_sci_Range.prototype.equals__O__Z = (function(other) {
  if ($is_sci_Range(other)) {
    var x2 = $as_sci_Range(other);
    if (this.isEmpty$4) {
      return x2.isEmpty$4
    } else if (($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(x2) && (this.start$4 === x2.start$4))) {
      var l0 = this.last__I();
      return ((l0 === x2.last__I()) && ((this.start$4 === l0) || (this.step$4 === x2.step$4)))
    } else {
      return false
    }
  } else {
    return $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z(this, other)
  }
});
$c_sci_Range.prototype.locationAfterN__p4__I__I = (function(n) {
  return ((this.start$4 + $imul(this.step$4, n)) | 0)
});
$c_sci_Range.prototype.apply$mcII$sp__I__I = (function(idx) {
  this.scala$collection$immutable$Range$$validateMaxLength__V();
  if (((idx < 0) || (idx >= this.numRangeElements$4))) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + idx))
  } else {
    return ((this.start$4 + $imul(this.step$4, idx)) | 0)
  }
});
$c_sci_Range.prototype.init___I__I__I = (function(start, end, step) {
  this.start$4 = start;
  this.end$4 = end;
  this.step$4 = step;
  this.isEmpty$4 = ((((start > end) && (step > 0)) || ((start < end) && (step < 0))) || ((start === end) && (!this.isInclusive__Z())));
  if ((step === 0)) {
    var jsx$1;
    throw new $c_jl_IllegalArgumentException().init___T("step cannot be 0.")
  } else if (this.isEmpty$4) {
    var jsx$1 = 0
  } else {
    var t = this.longLength__p4__J();
    var lo = t.lo$2;
    var hi = t.hi$2;
    var jsx$1 = (((hi === 0) ? (((-2147483648) ^ lo) > (-1)) : (hi > 0)) ? (-1) : lo)
  };
  this.numRangeElements$4 = jsx$1;
  if (this.isEmpty$4) {
    var jsx$2 = ((start - step) | 0)
  } else {
    switch (step) {
      case 1: {
        var jsx$2 = (this.isInclusive__Z() ? end : (((-1) + end) | 0));
        break
      }
      case (-1): {
        var jsx$2 = (this.isInclusive__Z() ? end : ((1 + end) | 0));
        break
      }
      default: {
        var t$1 = this.gap__p4__J();
        var lo$1 = t$1.lo$2;
        var hi$2 = t$1.hi$2;
        var hi$1 = (step >> 31);
        var this$1 = $m_sjsr_RuntimeLong$();
        var lo$2 = this$1.remainderImpl__I__I__I__I__I(lo$1, hi$2, step, hi$1);
        var jsx$2 = ((lo$2 !== 0) ? ((end - lo$2) | 0) : (this.isInclusive__Z() ? end : ((end - step) | 0)))
      }
    }
  };
  this.lastElement$4 = jsx$2;
  this.terminalElement$4 = ((this.lastElement$4 + step) | 0);
  return this
});
$c_sci_Range.prototype.toString__T = (function() {
  var endStr = (((this.numRangeElements$4 > $m_sci_Range$().MAX$undPRINT$1) || ((!this.isEmpty$4) && (this.numRangeElements$4 < 0))) ? ", ... )" : ")");
  var this$1 = this.take__I__sci_Range($m_sci_Range$().MAX$undPRINT$1);
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this$1, "Range(", ", ", endStr)
});
$c_sci_Range.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_IndexedSeq$()
});
$c_sci_Range.prototype.foreach__F1__V = (function(f) {
  if ((!this.isEmpty$4)) {
    var i = this.start$4;
    while (true) {
      f.apply__O__O(i);
      if ((i === this.lastElement$4)) {
        return (void 0)
      };
      i = ((i + this.step$4) | 0)
    }
  }
});
$c_sci_Range.prototype.hasStub__p4__Z = (function() {
  return (this.isInclusive__Z() || (!this.isExact__p4__Z()))
});
$c_sci_Range.prototype.copy__I__I__I__sci_Range = (function(start, end, step) {
  return new $c_sci_Range().init___I__I__I(start, end, step)
});
$c_sci_Range.prototype.tail__sci_Range = (function() {
  if (this.isEmpty$4) {
    $m_sci_Nil$().tail__sci_List()
  };
  return this.drop__I__sci_Range(1)
});
$c_sci_Range.prototype.size__I = (function() {
  return this.length__I()
});
$c_sci_Range.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, this.length__I())
});
$c_sci_Range.prototype.scala$collection$immutable$Range$$validateMaxLength__V = (function() {
  if ((this.numRangeElements$4 < 0)) {
    $m_sci_Range$().scala$collection$immutable$Range$$fail__I__I__I__Z__sr_Nothing$(this.start$4, this.end$4, this.step$4, this.isInclusive__Z())
  }
});
$c_sci_Range.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_Range.prototype.length__I = (function() {
  return ((this.numRangeElements$4 < 0) ? $m_sci_Range$().scala$collection$immutable$Range$$fail__I__I__I__Z__sr_Nothing$(this.start$4, this.end$4, this.step$4, this.isInclusive__Z()) : this.numRangeElements$4)
});
$c_sci_Range.prototype.drop__I__sci_Range = (function(n) {
  if (((n <= 0) || this.isEmpty$4)) {
    return this
  } else if (((n >= this.numRangeElements$4) && (this.numRangeElements$4 >= 0))) {
    var value = this.end$4;
    return new $c_sci_Range().init___I__I__I(value, value, this.step$4)
  } else {
    return this.copy__I__I__I__sci_Range(this.locationAfterN__p4__I__I(n), this.end$4, this.step$4)
  }
});
$c_sci_Range.prototype.isExact__p4__Z = (function() {
  var t = this.gap__p4__J();
  var lo = t.lo$2;
  var hi$1 = t.hi$2;
  var value = this.step$4;
  var hi = (value >> 31);
  var this$1 = $m_sjsr_RuntimeLong$();
  var lo$1 = this$1.remainderImpl__I__I__I__I__I(lo, hi$1, value, hi);
  var hi$2 = this$1.scala$scalajs$runtime$RuntimeLong$$hiReturn$f;
  return ((lo$1 === 0) && (hi$2 === 0))
});
$c_sci_Range.prototype.drop__I__O = (function(n) {
  return this.drop__I__sci_Range(n)
});
$c_sci_Range.prototype.tail__O = (function() {
  return this.tail__sci_Range()
});
$c_sci_Range.prototype.take__I__sci_Range = (function(n) {
  if (((n <= 0) || this.isEmpty$4)) {
    var value = this.start$4;
    return new $c_sci_Range().init___I__I__I(value, value, this.step$4)
  } else {
    return (((n >= this.numRangeElements$4) && (this.numRangeElements$4 >= 0)) ? this : new $c_sci_Range$Inclusive().init___I__I__I(this.start$4, this.locationAfterN__p4__I__I((((-1) + n) | 0)), this.step$4))
  }
});
$c_sci_Range.prototype.last__I = (function() {
  if (this.isEmpty$4) {
    var this$1 = $m_sci_Nil$();
    return $uI($s_sc_LinearSeqOptimized$class__last__sc_LinearSeqOptimized__O(this$1))
  } else {
    return this.lastElement$4
  }
});
$c_sci_Range.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_Range.prototype.head__I = (function() {
  return (this.isEmpty$4 ? $m_sci_Nil$().head__sr_Nothing$() : this.start$4)
});
$c_sci_Range.prototype.gap__p4__J = (function() {
  var value = this.end$4;
  var hi = (value >> 31);
  var value$1 = this.start$4;
  var hi$1 = (value$1 >> 31);
  var lo = ((value - value$1) | 0);
  var hi$2 = ((((-2147483648) ^ lo) > ((-2147483648) ^ value)) ? (((-1) + ((hi - hi$1) | 0)) | 0) : ((hi - hi$1) | 0));
  return new $c_sjsr_RuntimeLong().init___I__I(lo, hi$2)
});
function $is_sci_Range(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Range)))
}
function $as_sci_Range(obj) {
  return (($is_sci_Range(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Range"))
}
function $isArrayOf_sci_Range(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Range)))
}
function $asArrayOf_sci_Range(obj, depth) {
  return (($isArrayOf_sci_Range(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Range;", depth))
}
var $d_sci_Range = new $TypeData().initClass({
  sci_Range: 0
}, false, "scala.collection.immutable.Range", {
  sci_Range: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_IndexedSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Range.prototype.$classData = $d_sci_Range;
/** @constructor */
function $c_sci_Stream() {
  $c_sc_AbstractSeq.call(this)
}
$c_sci_Stream.prototype = new $h_sc_AbstractSeq();
$c_sci_Stream.prototype.constructor = $c_sci_Stream;
/** @constructor */
function $h_sci_Stream() {
  /*<skip>*/
}
$h_sci_Stream.prototype = $c_sci_Stream.prototype;
$c_sci_Stream.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Stream.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I(this, len)
});
$c_sci_Stream.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this, n)
});
$c_sci_Stream.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_Stream.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Stream.prototype.flatMap__F1__scg_CanBuildFrom__O = (function(f, bf) {
  if ($is_sci_Stream$StreamBuilder(bf.apply__O__scm_Builder(this))) {
    if (this.isEmpty__Z()) {
      var x$1 = $m_sci_Stream$Empty$()
    } else {
      var nonEmptyPrefix = new $c_sr_ObjectRef().init___O(this);
      var prefix = $as_sc_GenTraversableOnce(f.apply__O__O($as_sci_Stream(nonEmptyPrefix.elem$1).head__O())).toStream__sci_Stream();
      while (((!$as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z()) && prefix.isEmpty__Z())) {
        nonEmptyPrefix.elem$1 = $as_sci_Stream($as_sci_Stream(nonEmptyPrefix.elem$1).tail__O());
        if ((!$as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z())) {
          prefix = $as_sc_GenTraversableOnce(f.apply__O__O($as_sci_Stream(nonEmptyPrefix.elem$1).head__O())).toStream__sci_Stream()
        }
      };
      var x$1 = ($as_sci_Stream(nonEmptyPrefix.elem$1).isEmpty__Z() ? ($m_sci_Stream$(), $m_sci_Stream$Empty$()) : prefix.append__F0__sci_Stream(new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, f$1, nonEmptyPrefix$1) {
        return (function() {
          var x = $as_sci_Stream($as_sci_Stream(nonEmptyPrefix$1.elem$1).tail__O()).flatMap__F1__scg_CanBuildFrom__O(f$1, ($m_sci_Stream$(), new $c_sci_Stream$StreamCanBuildFrom().init___()));
          return $as_sci_Stream(x)
        })
      })(this, f, nonEmptyPrefix))))
    };
    return x$1
  } else {
    return $s_sc_TraversableLike$class__flatMap__sc_TraversableLike__F1__scg_CanBuildFrom__O(this, f, bf)
  }
});
$c_sci_Stream.prototype.drop__I__sc_LinearSeqOptimized = (function(n) {
  return this.drop__I__sci_Stream(n)
});
$c_sci_Stream.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  this.force__sci_Stream();
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, start, sep, end)
});
$c_sci_Stream.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Stream$()
});
$c_sci_Stream.prototype.toString__T = (function() {
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this, "Stream(", ", ", ")")
});
$c_sci_Stream.prototype.foreach__F1__V = (function(f) {
  var _$this = this;
  _foreach: while (true) {
    if ((!_$this.isEmpty__Z())) {
      f.apply__O__O(_$this.head__O());
      _$this = $as_sci_Stream(_$this.tail__O());
      continue _foreach
    };
    break
  }
});
$c_sci_Stream.prototype.iterator__sc_Iterator = (function() {
  return new $c_sci_StreamIterator().init___sci_Stream(this)
});
$c_sci_Stream.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_Stream.prototype.length__I = (function() {
  var len = 0;
  var left = this;
  while ((!left.isEmpty__Z())) {
    len = ((1 + len) | 0);
    left = $as_sci_Stream(left.tail__O())
  };
  return len
});
$c_sci_Stream.prototype.toStream__sci_Stream = (function() {
  return this
});
$c_sci_Stream.prototype.drop__I__O = (function(n) {
  return this.drop__I__sci_Stream(n)
});
$c_sci_Stream.prototype.drop__I__sci_Stream = (function(n) {
  var _$this = this;
  _drop: while (true) {
    if (((n <= 0) || _$this.isEmpty__Z())) {
      return _$this
    } else {
      var temp$_$this = $as_sci_Stream(_$this.tail__O());
      var temp$n = (((-1) + n) | 0);
      _$this = temp$_$this;
      n = temp$n;
      continue _drop
    }
  }
});
$c_sci_Stream.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  b.append__T__scm_StringBuilder(start);
  if ((!this.isEmpty__Z())) {
    b.append__O__scm_StringBuilder(this.head__O());
    var cursor = this;
    var n = 1;
    if (cursor.tailDefined__Z()) {
      var scout = $as_sci_Stream(this.tail__O());
      if (scout.isEmpty__Z()) {
        b.append__T__scm_StringBuilder(end);
        return b
      };
      if ((cursor !== scout)) {
        cursor = scout;
        if (scout.tailDefined__Z()) {
          scout = $as_sci_Stream(scout.tail__O());
          while (((cursor !== scout) && scout.tailDefined__Z())) {
            b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
            n = ((1 + n) | 0);
            cursor = $as_sci_Stream(cursor.tail__O());
            scout = $as_sci_Stream(scout.tail__O());
            if (scout.tailDefined__Z()) {
              scout = $as_sci_Stream(scout.tail__O())
            }
          }
        }
      };
      if ((!scout.tailDefined__Z())) {
        while ((cursor !== scout)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        var this$1 = cursor;
        if ($s_sc_TraversableOnce$class__nonEmpty__sc_TraversableOnce__Z(this$1)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O())
        }
      } else {
        var runner = this;
        var k = 0;
        while ((runner !== scout)) {
          runner = $as_sci_Stream(runner.tail__O());
          scout = $as_sci_Stream(scout.tail__O());
          k = ((1 + k) | 0)
        };
        if (((cursor === scout) && (k > 0))) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        while ((cursor !== scout)) {
          b.append__T__scm_StringBuilder(sep).append__O__scm_StringBuilder(cursor.head__O());
          n = ((1 + n) | 0);
          cursor = $as_sci_Stream(cursor.tail__O())
        };
        n = ((n - k) | 0)
      }
    };
    if ((!cursor.isEmpty__Z())) {
      if ((!cursor.tailDefined__Z())) {
        b.append__T__scm_StringBuilder(sep).append__T__scm_StringBuilder("?")
      } else {
        b.append__T__scm_StringBuilder(sep).append__T__scm_StringBuilder("...")
      }
    }
  };
  b.append__T__scm_StringBuilder(end);
  return b
});
$c_sci_Stream.prototype.force__sci_Stream = (function() {
  var these = this;
  var those = this;
  if ((!these.isEmpty__Z())) {
    these = $as_sci_Stream(these.tail__O())
  };
  while ((those !== these)) {
    if (these.isEmpty__Z()) {
      return this
    };
    these = $as_sci_Stream(these.tail__O());
    if (these.isEmpty__Z()) {
      return this
    };
    these = $as_sci_Stream(these.tail__O());
    if ((these === those)) {
      return this
    };
    those = $as_sci_Stream(those.tail__O())
  };
  return this
});
$c_sci_Stream.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_Stream.prototype.append__F0__sci_Stream = (function(rest) {
  if (this.isEmpty__Z()) {
    return $as_sc_GenTraversableOnce(rest.apply__O()).toStream__sci_Stream()
  } else {
    var hd = this.head__O();
    var tl = new $c_sjsr_AnonFunction0().init___sjs_js_Function0((function($this, rest$1) {
      return (function() {
        return $as_sci_Stream($this.tail__O()).append__F0__sci_Stream(rest$1)
      })
    })(this, rest));
    return new $c_sci_Stream$Cons().init___O__F0(hd, tl)
  }
});
$c_sci_Stream.prototype.stringPrefix__T = (function() {
  return "Stream"
});
function $is_sci_Stream(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_Stream)))
}
function $as_sci_Stream(obj) {
  return (($is_sci_Stream(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.Stream"))
}
function $isArrayOf_sci_Stream(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_Stream)))
}
function $asArrayOf_sci_Stream(obj, depth) {
  return (($isArrayOf_sci_Stream(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.Stream;", depth))
}
function $is_scm_ResizableArray(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ResizableArray)))
}
function $as_scm_ResizableArray(obj) {
  return (($is_scm_ResizableArray(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ResizableArray"))
}
function $isArrayOf_scm_ResizableArray(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ResizableArray)))
}
function $asArrayOf_scm_ResizableArray(obj, depth) {
  return (($isArrayOf_scm_ResizableArray(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ResizableArray;", depth))
}
function $is_sci_HashMap$HashMap1(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashMap$HashMap1)))
}
function $as_sci_HashMap$HashMap1(obj) {
  return (($is_sci_HashMap$HashMap1(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashMap$HashMap1"))
}
function $isArrayOf_sci_HashMap$HashMap1(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashMap$HashMap1)))
}
function $asArrayOf_sci_HashMap$HashMap1(obj, depth) {
  return (($isArrayOf_sci_HashMap$HashMap1(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashMap$HashMap1;", depth))
}
function $is_sci_HashMap$HashTrieMap(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_HashMap$HashTrieMap)))
}
function $as_sci_HashMap$HashTrieMap(obj) {
  return (($is_sci_HashMap$HashTrieMap(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.HashMap$HashTrieMap"))
}
function $isArrayOf_sci_HashMap$HashTrieMap(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_HashMap$HashTrieMap)))
}
function $asArrayOf_sci_HashMap$HashTrieMap(obj, depth) {
  return (($isArrayOf_sci_HashMap$HashTrieMap(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.HashMap$HashTrieMap;", depth))
}
/** @constructor */
function $c_sci_Range$Inclusive() {
  $c_sci_Range.call(this)
}
$c_sci_Range$Inclusive.prototype = new $h_sci_Range();
$c_sci_Range$Inclusive.prototype.constructor = $c_sci_Range$Inclusive;
/** @constructor */
function $h_sci_Range$Inclusive() {
  /*<skip>*/
}
$h_sci_Range$Inclusive.prototype = $c_sci_Range$Inclusive.prototype;
$c_sci_Range$Inclusive.prototype.isInclusive__Z = (function() {
  return true
});
$c_sci_Range$Inclusive.prototype.init___I__I__I = (function(start, end, step) {
  $c_sci_Range.prototype.init___I__I__I.call(this, start, end, step);
  return this
});
$c_sci_Range$Inclusive.prototype.copy__I__I__I__sci_Range = (function(start, end, step) {
  return new $c_sci_Range$Inclusive().init___I__I__I(start, end, step)
});
var $d_sci_Range$Inclusive = new $TypeData().initClass({
  sci_Range$Inclusive: 0
}, false, "scala.collection.immutable.Range$Inclusive", {
  sci_Range$Inclusive: 1,
  sci_Range: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_IndexedSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Range$Inclusive.prototype.$classData = $d_sci_Range$Inclusive;
/** @constructor */
function $c_sci_Stream$Cons() {
  $c_sci_Stream.call(this);
  this.hd$5 = null;
  this.tlVal$5 = null;
  this.tlGen$5 = null
}
$c_sci_Stream$Cons.prototype = new $h_sci_Stream();
$c_sci_Stream$Cons.prototype.constructor = $c_sci_Stream$Cons;
/** @constructor */
function $h_sci_Stream$Cons() {
  /*<skip>*/
}
$h_sci_Stream$Cons.prototype = $c_sci_Stream$Cons.prototype;
$c_sci_Stream$Cons.prototype.head__O = (function() {
  return this.hd$5
});
$c_sci_Stream$Cons.prototype.tail__sci_Stream = (function() {
  if ((!this.tailDefined__Z())) {
    if ((!this.tailDefined__Z())) {
      this.tlVal$5 = $as_sci_Stream(this.tlGen$5.apply__O());
      this.tlGen$5 = null
    }
  };
  return this.tlVal$5
});
$c_sci_Stream$Cons.prototype.tailDefined__Z = (function() {
  return (this.tlGen$5 === null)
});
$c_sci_Stream$Cons.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_Stream$Cons.prototype.tail__O = (function() {
  return this.tail__sci_Stream()
});
$c_sci_Stream$Cons.prototype.init___O__F0 = (function(hd, tl) {
  this.hd$5 = hd;
  this.tlGen$5 = tl;
  return this
});
var $d_sci_Stream$Cons = new $TypeData().initClass({
  sci_Stream$Cons: 0
}, false, "scala.collection.immutable.Stream$Cons", {
  sci_Stream$Cons: 1,
  sci_Stream: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  sc_LinearSeqOptimized: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$Cons.prototype.$classData = $d_sci_Stream$Cons;
/** @constructor */
function $c_sci_Stream$Empty$() {
  $c_sci_Stream.call(this)
}
$c_sci_Stream$Empty$.prototype = new $h_sci_Stream();
$c_sci_Stream$Empty$.prototype.constructor = $c_sci_Stream$Empty$;
/** @constructor */
function $h_sci_Stream$Empty$() {
  /*<skip>*/
}
$h_sci_Stream$Empty$.prototype = $c_sci_Stream$Empty$.prototype;
$c_sci_Stream$Empty$.prototype.init___ = (function() {
  return this
});
$c_sci_Stream$Empty$.prototype.head__O = (function() {
  this.head__sr_Nothing$()
});
$c_sci_Stream$Empty$.prototype.tailDefined__Z = (function() {
  return false
});
$c_sci_Stream$Empty$.prototype.isEmpty__Z = (function() {
  return true
});
$c_sci_Stream$Empty$.prototype.tail__sr_Nothing$ = (function() {
  throw new $c_jl_UnsupportedOperationException().init___T("tail of empty stream")
});
$c_sci_Stream$Empty$.prototype.head__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("head of empty stream")
});
$c_sci_Stream$Empty$.prototype.tail__O = (function() {
  this.tail__sr_Nothing$()
});
var $d_sci_Stream$Empty$ = new $TypeData().initClass({
  sci_Stream$Empty$: 0
}, false, "scala.collection.immutable.Stream$Empty$", {
  sci_Stream$Empty$: 1,
  sci_Stream: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  sc_LinearSeqOptimized: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_sci_Stream$Empty$.prototype.$classData = $d_sci_Stream$Empty$;
var $n_sci_Stream$Empty$ = (void 0);
function $m_sci_Stream$Empty$() {
  if ((!$n_sci_Stream$Empty$)) {
    $n_sci_Stream$Empty$ = new $c_sci_Stream$Empty$().init___()
  };
  return $n_sci_Stream$Empty$
}
/** @constructor */
function $c_sci_Vector() {
  $c_sc_AbstractSeq.call(this);
  this.startIndex$4 = 0;
  this.endIndex$4 = 0;
  this.focus$4 = 0;
  this.dirty$4 = false;
  this.depth$4 = 0;
  this.display0$4 = null;
  this.display1$4 = null;
  this.display2$4 = null;
  this.display3$4 = null;
  this.display4$4 = null;
  this.display5$4 = null
}
$c_sci_Vector.prototype = new $h_sc_AbstractSeq();
$c_sci_Vector.prototype.constructor = $c_sci_Vector;
/** @constructor */
function $h_sci_Vector() {
  /*<skip>*/
}
$h_sci_Vector.prototype = $c_sci_Vector.prototype;
$c_sci_Vector.prototype.checkRangeConvert__p4__I__I = (function(index) {
  var idx = ((index + this.startIndex$4) | 0);
  if (((index >= 0) && (idx < this.endIndex$4))) {
    return idx
  } else {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + index))
  }
});
$c_sci_Vector.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_Vector.prototype.display3__AO = (function() {
  return this.display3$4
});
$c_sci_Vector.prototype.gotoPosWritable__p4__I__I__I__V = (function(oldIndex, newIndex, xor) {
  if (this.dirty$4) {
    $s_sci_VectorPointer$class__gotoPosWritable1__sci_VectorPointer__I__I__I__V(this, oldIndex, newIndex, xor)
  } else {
    $s_sci_VectorPointer$class__gotoPosWritable0__sci_VectorPointer__I__I__V(this, newIndex, xor);
    this.dirty$4 = true
  }
});
$c_sci_Vector.prototype.head__O = (function() {
  if ($s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z(this)) {
    throw new $c_jl_UnsupportedOperationException().init___T("empty.head")
  };
  return this.apply__I__O(0)
});
$c_sci_Vector.prototype.apply__I__O = (function(index) {
  var idx = this.checkRangeConvert__p4__I__I(index);
  var xor = (idx ^ this.focus$4);
  return $s_sci_VectorPointer$class__getElem__sci_VectorPointer__I__I__O(this, idx, xor)
});
$c_sci_Vector.prototype.depth__I = (function() {
  return this.depth$4
});
$c_sci_Vector.prototype.lengthCompare__I__I = (function(len) {
  return ((this.length__I() - len) | 0)
});
$c_sci_Vector.prototype.apply__O__O = (function(v1) {
  return this.apply__I__O($uI(v1))
});
$c_sci_Vector.prototype.initIterator__sci_VectorIterator__V = (function(s) {
  var depth = this.depth$4;
  $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s, this, depth);
  if (this.dirty$4) {
    var index = this.focus$4;
    $s_sci_VectorPointer$class__stabilize__sci_VectorPointer__I__V(s, index)
  };
  if ((s.depth$2 > 1)) {
    var index$1 = this.startIndex$4;
    var xor = (this.startIndex$4 ^ this.focus$4);
    $s_sci_VectorPointer$class__gotoPos__sci_VectorPointer__I__I__V(s, index$1, xor)
  }
});
$c_sci_Vector.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_Vector.prototype.init___I__I__I = (function(startIndex, endIndex, focus) {
  this.startIndex$4 = startIndex;
  this.endIndex$4 = endIndex;
  this.focus$4 = focus;
  this.dirty$4 = false;
  return this
});
$c_sci_Vector.prototype.display5$und$eq__AO__V = (function(x$1) {
  this.display5$4 = x$1
});
$c_sci_Vector.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_Vector$()
});
$c_sci_Vector.prototype.cleanLeftEdge__p4__I__V = (function(cutIndex) {
  if ((cutIndex < 32)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, cutIndex)
  } else if ((cutIndex < 1024)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, (31 & cutIndex));
    this.display1$4 = this.copyRight__p4__AO__I__AO(this.display1$4, ((cutIndex >>> 5) | 0))
  } else if ((cutIndex < 32768)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, (31 & cutIndex));
    this.display1$4 = this.copyRight__p4__AO__I__AO(this.display1$4, (31 & ((cutIndex >>> 5) | 0)));
    this.display2$4 = this.copyRight__p4__AO__I__AO(this.display2$4, ((cutIndex >>> 10) | 0))
  } else if ((cutIndex < 1048576)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, (31 & cutIndex));
    this.display1$4 = this.copyRight__p4__AO__I__AO(this.display1$4, (31 & ((cutIndex >>> 5) | 0)));
    this.display2$4 = this.copyRight__p4__AO__I__AO(this.display2$4, (31 & ((cutIndex >>> 10) | 0)));
    this.display3$4 = this.copyRight__p4__AO__I__AO(this.display3$4, ((cutIndex >>> 15) | 0))
  } else if ((cutIndex < 33554432)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, (31 & cutIndex));
    this.display1$4 = this.copyRight__p4__AO__I__AO(this.display1$4, (31 & ((cutIndex >>> 5) | 0)));
    this.display2$4 = this.copyRight__p4__AO__I__AO(this.display2$4, (31 & ((cutIndex >>> 10) | 0)));
    this.display3$4 = this.copyRight__p4__AO__I__AO(this.display3$4, (31 & ((cutIndex >>> 15) | 0)));
    this.display4$4 = this.copyRight__p4__AO__I__AO(this.display4$4, ((cutIndex >>> 20) | 0))
  } else if ((cutIndex < 1073741824)) {
    this.zeroLeft__p4__AO__I__V(this.display0$4, (31 & cutIndex));
    this.display1$4 = this.copyRight__p4__AO__I__AO(this.display1$4, (31 & ((cutIndex >>> 5) | 0)));
    this.display2$4 = this.copyRight__p4__AO__I__AO(this.display2$4, (31 & ((cutIndex >>> 10) | 0)));
    this.display3$4 = this.copyRight__p4__AO__I__AO(this.display3$4, (31 & ((cutIndex >>> 15) | 0)));
    this.display4$4 = this.copyRight__p4__AO__I__AO(this.display4$4, (31 & ((cutIndex >>> 20) | 0)));
    this.display5$4 = this.copyRight__p4__AO__I__AO(this.display5$4, ((cutIndex >>> 25) | 0))
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
});
$c_sci_Vector.prototype.display0__AO = (function() {
  return this.display0$4
});
$c_sci_Vector.prototype.display2$und$eq__AO__V = (function(x$1) {
  this.display2$4 = x$1
});
$c_sci_Vector.prototype.display4__AO = (function() {
  return this.display4$4
});
$c_sci_Vector.prototype.tail__sci_Vector = (function() {
  if ($s_sc_SeqLike$class__isEmpty__sc_SeqLike__Z(this)) {
    throw new $c_jl_UnsupportedOperationException().init___T("empty.tail")
  };
  return this.drop__I__sci_Vector(1)
});
$c_sci_Vector.prototype.preClean__p4__I__V = (function(depth) {
  this.depth$4 = depth;
  var x1 = (((-1) + depth) | 0);
  switch (x1) {
    case 0: {
      this.display1$4 = null;
      this.display2$4 = null;
      this.display3$4 = null;
      this.display4$4 = null;
      this.display5$4 = null;
      break
    }
    case 1: {
      this.display2$4 = null;
      this.display3$4 = null;
      this.display4$4 = null;
      this.display5$4 = null;
      break
    }
    case 2: {
      this.display3$4 = null;
      this.display4$4 = null;
      this.display5$4 = null;
      break
    }
    case 3: {
      this.display4$4 = null;
      this.display5$4 = null;
      break
    }
    case 4: {
      this.display5$4 = null;
      break
    }
    case 5: {
      break
    }
    default: {
      throw new $c_s_MatchError().init___O(x1)
    }
  }
});
$c_sci_Vector.prototype.iterator__sc_Iterator = (function() {
  return this.iterator__sci_VectorIterator()
});
$c_sci_Vector.prototype.display1$und$eq__AO__V = (function(x$1) {
  this.display1$4 = x$1
});
$c_sci_Vector.prototype.length__I = (function() {
  return ((this.endIndex$4 - this.startIndex$4) | 0)
});
$c_sci_Vector.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_Vector.prototype.display4$und$eq__AO__V = (function(x$1) {
  this.display4$4 = x$1
});
$c_sci_Vector.prototype.display1__AO = (function() {
  return this.display1$4
});
$c_sci_Vector.prototype.drop__I__O = (function(n) {
  return this.drop__I__sci_Vector(n)
});
$c_sci_Vector.prototype.display5__AO = (function() {
  return this.display5$4
});
$c_sci_Vector.prototype.tail__O = (function() {
  return this.tail__sci_Vector()
});
$c_sci_Vector.prototype.iterator__sci_VectorIterator = (function() {
  var s = new $c_sci_VectorIterator().init___I__I(this.startIndex$4, this.endIndex$4);
  this.initIterator__sci_VectorIterator__V(s);
  return s
});
$c_sci_Vector.prototype.requiredDepth__p4__I__I = (function(xor) {
  if ((xor < 32)) {
    return 1
  } else if ((xor < 1024)) {
    return 2
  } else if ((xor < 32768)) {
    return 3
  } else if ((xor < 1048576)) {
    return 4
  } else if ((xor < 33554432)) {
    return 5
  } else if ((xor < 1073741824)) {
    return 6
  } else {
    throw new $c_jl_IllegalArgumentException().init___()
  }
});
$c_sci_Vector.prototype.zeroLeft__p4__AO__I__V = (function(array, index) {
  var i = 0;
  while ((i < index)) {
    array.u[i] = null;
    i = ((1 + i) | 0)
  }
});
$c_sci_Vector.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_Vector.prototype.depth$und$eq__I__V = (function(x$1) {
  this.depth$4 = x$1
});
$c_sci_Vector.prototype.display2__AO = (function() {
  return this.display2$4
});
$c_sci_Vector.prototype.dropFront0__p4__I__sci_Vector = (function(cutIndex) {
  var blockIndex = ((-32) & cutIndex);
  var xor = (cutIndex ^ (((-1) + this.endIndex$4) | 0));
  var d = this.requiredDepth__p4__I__I(xor);
  var shift = (cutIndex & (~(((-1) + (1 << $imul(5, d))) | 0)));
  var s = new $c_sci_Vector().init___I__I__I(((cutIndex - shift) | 0), ((this.endIndex$4 - shift) | 0), ((blockIndex - shift) | 0));
  var depth = this.depth$4;
  $s_sci_VectorPointer$class__initFrom__sci_VectorPointer__sci_VectorPointer__I__V(s, this, depth);
  s.dirty$4 = this.dirty$4;
  s.gotoPosWritable__p4__I__I__I__V(this.focus$4, blockIndex, (this.focus$4 ^ blockIndex));
  s.preClean__p4__I__V(d);
  s.cleanLeftEdge__p4__I__V(((cutIndex - shift) | 0));
  return s
});
$c_sci_Vector.prototype.display0$und$eq__AO__V = (function(x$1) {
  this.display0$4 = x$1
});
$c_sci_Vector.prototype.drop__I__sci_Vector = (function(n) {
  if ((n <= 0)) {
    return this
  } else if ((this.startIndex$4 < ((this.endIndex$4 - n) | 0))) {
    return this.dropFront0__p4__I__sci_Vector(((this.startIndex$4 + n) | 0))
  } else {
    var this$1 = $m_sci_Vector$();
    return this$1.NIL$6
  }
});
$c_sci_Vector.prototype.display3$und$eq__AO__V = (function(x$1) {
  this.display3$4 = x$1
});
$c_sci_Vector.prototype.copyRight__p4__AO__I__AO = (function(array, left) {
  var a2 = $newArrayObject($d_O.getArrayOf(), [array.u.length]);
  var length = ((a2.u.length - left) | 0);
  $systemArraycopy(array, left, a2, left, length);
  return a2
});
var $d_sci_Vector = new $TypeData().initClass({
  sci_Vector: 0
}, false, "scala.collection.immutable.Vector", {
  sci_Vector: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_IndexedSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  sci_VectorPointer: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1,
  sc_CustomParallelizable: 1
});
$c_sci_Vector.prototype.$classData = $d_sci_Vector;
/** @constructor */
function $c_sci_WrappedString() {
  $c_sc_AbstractSeq.call(this);
  this.self$4 = null
}
$c_sci_WrappedString.prototype = new $h_sc_AbstractSeq();
$c_sci_WrappedString.prototype.constructor = $c_sci_WrappedString;
/** @constructor */
function $h_sci_WrappedString() {
  /*<skip>*/
}
$h_sci_WrappedString.prototype = $c_sci_WrappedString.prototype;
$c_sci_WrappedString.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sci_WrappedString.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_sci_WrappedString.prototype.apply__I__O = (function(idx) {
  var thiz = this.self$4;
  var c = (65535 & $uI(thiz.charCodeAt(idx)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_WrappedString.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_sci_WrappedString.prototype.apply__O__O = (function(v1) {
  var n = $uI(v1);
  var thiz = this.self$4;
  var c = (65535 & $uI(thiz.charCodeAt(n)));
  return new $c_jl_Character().init___C(c)
});
$c_sci_WrappedString.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sci_WrappedString.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_sci_WrappedString.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sci_WrappedString.prototype.toString__T = (function() {
  return this.self$4
});
$c_sci_WrappedString.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sci_IndexedSeq$()
});
$c_sci_WrappedString.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_sci_WrappedString.prototype.slice__I__I__O = (function(from, until) {
  return this.slice__I__I__sci_WrappedString(from, until)
});
$c_sci_WrappedString.prototype.iterator__sc_Iterator = (function() {
  var thiz = this.self$4;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(thiz.length))
});
$c_sci_WrappedString.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sci_WrappedString.prototype.length__I = (function() {
  var thiz = this.self$4;
  return $uI(thiz.length)
});
$c_sci_WrappedString.prototype.drop__I__O = (function(n) {
  var thiz = this.self$4;
  var until = $uI(thiz.length);
  return this.slice__I__I__sci_WrappedString(n, until)
});
$c_sci_WrappedString.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_sci_WrappedString.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_sci_WrappedString.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sci_WrappedString.prototype.init___T = (function(self) {
  this.self$4 = self;
  return this
});
$c_sci_WrappedString.prototype.slice__I__I__sci_WrappedString = (function(from, until) {
  var start = ((from < 0) ? 0 : from);
  if ((until <= start)) {
    var jsx$1 = true
  } else {
    var thiz = this.self$4;
    var jsx$1 = (start >= $uI(thiz.length))
  };
  if (jsx$1) {
    return new $c_sci_WrappedString().init___T("")
  };
  var thiz$1 = this.self$4;
  if ((until > $uI(thiz$1.length))) {
    var thiz$2 = this.self$4;
    var end = $uI(thiz$2.length)
  } else {
    var end = until
  };
  var thiz$3 = $m_s_Predef$().unwrapString__sci_WrappedString__T(this);
  return new $c_sci_WrappedString().init___T($as_T(thiz$3.substring(start, end)))
});
$c_sci_WrappedString.prototype.newBuilder__scm_Builder = (function() {
  return $m_sci_WrappedString$().newBuilder__scm_Builder()
});
var $d_sci_WrappedString = new $TypeData().initClass({
  sci_WrappedString: 0
}, false, "scala.collection.immutable.WrappedString", {
  sci_WrappedString: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_IndexedSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1
});
$c_sci_WrappedString.prototype.$classData = $d_sci_WrappedString;
/** @constructor */
function $c_sci_$colon$colon() {
  $c_sci_List.call(this);
  this.head$5 = null;
  this.tl$5 = null
}
$c_sci_$colon$colon.prototype = new $h_sci_List();
$c_sci_$colon$colon.prototype.constructor = $c_sci_$colon$colon;
/** @constructor */
function $h_sci_$colon$colon() {
  /*<skip>*/
}
$h_sci_$colon$colon.prototype = $c_sci_$colon$colon.prototype;
$c_sci_$colon$colon.prototype.productPrefix__T = (function() {
  return "::"
});
$c_sci_$colon$colon.prototype.head__O = (function() {
  return this.head$5
});
$c_sci_$colon$colon.prototype.productArity__I = (function() {
  return 2
});
$c_sci_$colon$colon.prototype.isEmpty__Z = (function() {
  return false
});
$c_sci_$colon$colon.prototype.productElement__I__O = (function(x$1) {
  switch (x$1) {
    case 0: {
      return this.head$5;
      break
    }
    case 1: {
      return this.tl$5;
      break
    }
    default: {
      throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
    }
  }
});
$c_sci_$colon$colon.prototype.tail__O = (function() {
  return this.tl$5
});
$c_sci_$colon$colon.prototype.init___O__sci_List = (function(head, tl) {
  this.head$5 = head;
  this.tl$5 = tl;
  return this
});
$c_sci_$colon$colon.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
function $is_sci_$colon$colon(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.sci_$colon$colon)))
}
function $as_sci_$colon$colon(obj) {
  return (($is_sci_$colon$colon(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.immutable.$colon$colon"))
}
function $isArrayOf_sci_$colon$colon(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.sci_$colon$colon)))
}
function $asArrayOf_sci_$colon$colon(obj, depth) {
  return (($isArrayOf_sci_$colon$colon(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.immutable.$colon$colon;", depth))
}
var $d_sci_$colon$colon = new $TypeData().initClass({
  sci_$colon$colon: 0
}, false, "scala.collection.immutable.$colon$colon", {
  sci_$colon$colon: 1,
  sci_List: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  s_Product: 1,
  sc_LinearSeqOptimized: 1,
  Ljava_io_Serializable: 1,
  s_Serializable: 1
});
$c_sci_$colon$colon.prototype.$classData = $d_sci_$colon$colon;
/** @constructor */
function $c_sci_Nil$() {
  $c_sci_List.call(this)
}
$c_sci_Nil$.prototype = new $h_sci_List();
$c_sci_Nil$.prototype.constructor = $c_sci_Nil$;
/** @constructor */
function $h_sci_Nil$() {
  /*<skip>*/
}
$h_sci_Nil$.prototype = $c_sci_Nil$.prototype;
$c_sci_Nil$.prototype.init___ = (function() {
  return this
});
$c_sci_Nil$.prototype.head__O = (function() {
  this.head__sr_Nothing$()
});
$c_sci_Nil$.prototype.productPrefix__T = (function() {
  return "Nil"
});
$c_sci_Nil$.prototype.productArity__I = (function() {
  return 0
});
$c_sci_Nil$.prototype.equals__O__Z = (function(that) {
  if ($is_sc_GenSeq(that)) {
    var x2 = $as_sc_GenSeq(that);
    return x2.isEmpty__Z()
  } else {
    return false
  }
});
$c_sci_Nil$.prototype.tail__sci_List = (function() {
  throw new $c_jl_UnsupportedOperationException().init___T("tail of empty list")
});
$c_sci_Nil$.prototype.isEmpty__Z = (function() {
  return true
});
$c_sci_Nil$.prototype.productElement__I__O = (function(x$1) {
  throw new $c_jl_IndexOutOfBoundsException().init___T(("" + x$1))
});
$c_sci_Nil$.prototype.head__sr_Nothing$ = (function() {
  throw new $c_ju_NoSuchElementException().init___T("head of empty list")
});
$c_sci_Nil$.prototype.tail__O = (function() {
  return this.tail__sci_List()
});
$c_sci_Nil$.prototype.productIterator__sc_Iterator = (function() {
  return new $c_sr_ScalaRunTime$$anon$1().init___s_Product(this)
});
var $d_sci_Nil$ = new $TypeData().initClass({
  sci_Nil$: 0
}, false, "scala.collection.immutable.Nil$", {
  sci_Nil$: 1,
  sci_List: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  sci_LinearSeq: 1,
  sci_Seq: 1,
  sci_Iterable: 1,
  sci_Traversable: 1,
  s_Immutable: 1,
  sc_LinearSeq: 1,
  sc_LinearSeqLike: 1,
  s_Product: 1,
  sc_LinearSeqOptimized: 1,
  Ljava_io_Serializable: 1,
  s_Serializable: 1
});
$c_sci_Nil$.prototype.$classData = $d_sci_Nil$;
var $n_sci_Nil$ = (void 0);
function $m_sci_Nil$() {
  if ((!$n_sci_Nil$)) {
    $n_sci_Nil$ = new $c_sci_Nil$().init___()
  };
  return $n_sci_Nil$
}
/** @constructor */
function $c_scm_AbstractMap() {
  $c_sc_AbstractMap.call(this)
}
$c_scm_AbstractMap.prototype = new $h_sc_AbstractMap();
$c_scm_AbstractMap.prototype.constructor = $c_scm_AbstractMap;
/** @constructor */
function $h_scm_AbstractMap() {
  /*<skip>*/
}
$h_scm_AbstractMap.prototype = $c_scm_AbstractMap.prototype;
$c_scm_AbstractMap.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_Iterable$()
});
$c_scm_AbstractMap.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_AbstractMap.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_AbstractMap.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
$c_scm_AbstractMap.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_HashMap().init___()
});
/** @constructor */
function $c_scm_AbstractSet() {
  $c_scm_AbstractIterable.call(this)
}
$c_scm_AbstractSet.prototype = new $h_scm_AbstractIterable();
$c_scm_AbstractSet.prototype.constructor = $c_scm_AbstractSet;
/** @constructor */
function $h_scm_AbstractSet() {
  /*<skip>*/
}
$h_scm_AbstractSet.prototype = $c_scm_AbstractSet.prototype;
$c_scm_AbstractSet.prototype.isEmpty__Z = (function() {
  return $s_sc_SetLike$class__isEmpty__sc_SetLike__Z(this)
});
$c_scm_AbstractSet.prototype.equals__O__Z = (function(that) {
  return $s_sc_GenSetLike$class__equals__sc_GenSetLike__O__Z(this, that)
});
$c_scm_AbstractSet.prototype.toString__T = (function() {
  return $s_sc_TraversableLike$class__toString__sc_TraversableLike__T(this)
});
$c_scm_AbstractSet.prototype.subsetOf__sc_GenSet__Z = (function(that) {
  var this$1 = new $c_scm_FlatHashTable$$anon$1().init___scm_FlatHashTable(this);
  return $s_sc_Iterator$class__forall__sc_Iterator__F1__Z(this$1, that)
});
$c_scm_AbstractSet.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_AbstractSet.prototype.hashCode__I = (function() {
  var this$1 = $m_s_util_hashing_MurmurHash3$();
  return this$1.unorderedHash__sc_TraversableOnce__I__I(this, this$1.setSeed$2)
});
$c_scm_AbstractSet.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_AbstractSet.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_HashSet().init___()
});
$c_scm_AbstractSet.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
$c_scm_AbstractSet.prototype.stringPrefix__T = (function() {
  return "Set"
});
/** @constructor */
function $c_scm_AbstractBuffer() {
  $c_scm_AbstractSeq.call(this)
}
$c_scm_AbstractBuffer.prototype = new $h_scm_AbstractSeq();
$c_scm_AbstractBuffer.prototype.constructor = $c_scm_AbstractBuffer;
/** @constructor */
function $h_scm_AbstractBuffer() {
  /*<skip>*/
}
$h_scm_AbstractBuffer.prototype = $c_scm_AbstractBuffer.prototype;
$c_scm_AbstractBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
/** @constructor */
function $c_scm_WrappedArray() {
  $c_scm_AbstractSeq.call(this)
}
$c_scm_WrappedArray.prototype = new $h_scm_AbstractSeq();
$c_scm_WrappedArray.prototype.constructor = $c_scm_WrappedArray;
/** @constructor */
function $h_scm_WrappedArray() {
  /*<skip>*/
}
$h_scm_WrappedArray.prototype = $c_scm_WrappedArray.prototype;
$c_scm_WrappedArray.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_WrappedArray.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_scm_WrappedArray.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_scm_WrappedArray.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_scm_WrappedArray.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_scm_WrappedArray.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_WrappedArray.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_IndexedSeq$()
});
$c_scm_WrappedArray.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_scm_WrappedArray.prototype.slice__I__I__O = (function(from, until) {
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, from, until)
});
$c_scm_WrappedArray.prototype.seq__scm_Seq = (function() {
  return this
});
$c_scm_WrappedArray.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, this.length__I())
});
$c_scm_WrappedArray.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_WrappedArray.prototype.drop__I__O = (function(n) {
  var until = this.length__I();
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, n, until)
});
$c_scm_WrappedArray.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_scm_WrappedArray.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_scm_WrappedArray.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_scm_WrappedArray.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_WrappedArrayBuilder().init___s_reflect_ClassTag(this.elemTag__s_reflect_ClassTag())
});
$c_scm_WrappedArray.prototype.stringPrefix__T = (function() {
  return "WrappedArray"
});
/** @constructor */
function $c_scm_HashMap() {
  $c_scm_AbstractMap.call(this);
  this.$$undloadFactor$5 = 0;
  this.table$5 = null;
  this.tableSize$5 = 0;
  this.threshold$5 = 0;
  this.sizemap$5 = null;
  this.seedvalue$5 = 0
}
$c_scm_HashMap.prototype = new $h_scm_AbstractMap();
$c_scm_HashMap.prototype.constructor = $c_scm_HashMap;
/** @constructor */
function $h_scm_HashMap() {
  /*<skip>*/
}
$h_scm_HashMap.prototype = $c_scm_HashMap.prototype;
$c_scm_HashMap.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_HashMap.prototype.put__O__O__s_Option = (function(key, value) {
  var e = $as_scm_DefaultEntry($s_scm_HashTable$class__findOrAddEntry__scm_HashTable__O__O__scm_HashEntry(this, key, value));
  if ((e === null)) {
    return $m_s_None$()
  } else {
    var v = e.value$1;
    e.value$1 = value;
    return new $c_s_Some().init___O(v)
  }
});
$c_scm_HashMap.prototype.init___ = (function() {
  $c_scm_HashMap.prototype.init___scm_HashTable$Contents.call(this, null);
  return this
});
$c_scm_HashMap.prototype.apply__O__O = (function(key) {
  var result = $as_scm_DefaultEntry($s_scm_HashTable$class__findEntry__scm_HashTable__O__scm_HashEntry(this, key));
  return ((result === null) ? $s_sc_MapLike$class__$default__sc_MapLike__O__O(this, key) : result.value$1)
});
$c_scm_HashMap.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_HashMap.prototype.$$plus$eq__T2__scm_HashMap = (function(kv) {
  var key = kv.$$und1$f;
  var value = kv.$$und2$f;
  var e = $as_scm_DefaultEntry($s_scm_HashTable$class__findOrAddEntry__scm_HashTable__O__O__scm_HashEntry(this, key, value));
  if ((e !== null)) {
    e.value$1 = kv.$$und2$f
  };
  return this
});
$c_scm_HashMap.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__T2__scm_HashMap($as_T2(elem))
});
$c_scm_HashMap.prototype.foreach__F1__V = (function(f) {
  var iterTable = this.table$5;
  var idx = $s_scm_HashTable$class__scala$collection$mutable$HashTable$$lastPopulatedIndex__scm_HashTable__I(this);
  var es = iterTable.u[idx];
  while ((es !== null)) {
    var arg1 = es;
    var e = $as_scm_DefaultEntry(arg1);
    f.apply__O__O(new $c_T2().init___O__O(e.key$1, e.value$1));
    es = $as_scm_HashEntry(es.next$1);
    while (((es === null) && (idx > 0))) {
      idx = (((-1) + idx) | 0);
      es = iterTable.u[idx]
    }
  }
});
$c_scm_HashMap.prototype.size__I = (function() {
  return this.tableSize$5
});
$c_scm_HashMap.prototype.result__O = (function() {
  return this
});
$c_scm_HashMap.prototype.iterator__sc_Iterator = (function() {
  var this$1 = new $c_scm_HashTable$$anon$1().init___scm_HashTable(this);
  var f = new $c_sjsr_AnonFunction1().init___sjs_js_Function1((function($this) {
    return (function(e$2) {
      var e = $as_scm_DefaultEntry(e$2);
      return new $c_T2().init___O__O(e.key$1, e.value$1)
    })
  })(this));
  return new $c_sc_Iterator$$anon$11().init___sc_Iterator__F1(this$1, f)
});
$c_scm_HashMap.prototype.init___scm_HashTable$Contents = (function(contents) {
  $s_scm_HashTable$class__$$init$__scm_HashTable__V(this);
  $s_scm_HashTable$class__initWithContents__scm_HashTable__scm_HashTable$Contents__V(this, contents);
  return this
});
$c_scm_HashMap.prototype.get__O__s_Option = (function(key) {
  var e = $as_scm_DefaultEntry($s_scm_HashTable$class__findEntry__scm_HashTable__O__scm_HashEntry(this, key));
  return ((e === null) ? $m_s_None$() : new $c_s_Some().init___O(e.value$1))
});
$c_scm_HashMap.prototype.contains__O__Z = (function(key) {
  return ($s_scm_HashTable$class__findEntry__scm_HashTable__O__scm_HashEntry(this, key) !== null)
});
$c_scm_HashMap.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__T2__scm_HashMap($as_T2(elem))
});
var $d_scm_HashMap = new $TypeData().initClass({
  scm_HashMap: 0
}, false, "scala.collection.mutable.HashMap", {
  scm_HashMap: 1,
  scm_AbstractMap: 1,
  sc_AbstractMap: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Map: 1,
  sc_GenMap: 1,
  sc_GenMapLike: 1,
  sc_MapLike: 1,
  s_PartialFunction: 1,
  F1: 1,
  scg_Subtractable: 1,
  scm_Map: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_MapLike: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_HashTable: 1,
  scm_HashTable$HashUtils: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_HashMap.prototype.$classData = $d_scm_HashMap;
/** @constructor */
function $c_scm_HashSet() {
  $c_scm_AbstractSet.call(this);
  this.$$undloadFactor$5 = 0;
  this.table$5 = null;
  this.tableSize$5 = 0;
  this.threshold$5 = 0;
  this.sizemap$5 = null;
  this.seedvalue$5 = 0
}
$c_scm_HashSet.prototype = new $h_scm_AbstractSet();
$c_scm_HashSet.prototype.constructor = $c_scm_HashSet;
/** @constructor */
function $h_scm_HashSet() {
  /*<skip>*/
}
$h_scm_HashSet.prototype = $c_scm_HashSet.prototype;
$c_scm_HashSet.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_HashSet.prototype.init___ = (function() {
  $c_scm_HashSet.prototype.init___scm_FlatHashTable$Contents.call(this, null);
  return this
});
$c_scm_HashSet.prototype.apply__O__O = (function(v1) {
  return $s_scm_FlatHashTable$class__containsElem__scm_FlatHashTable__O__Z(this, v1)
});
$c_scm_HashSet.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_HashSet.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_HashSet(elem)
});
$c_scm_HashSet.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_HashSet$()
});
$c_scm_HashSet.prototype.foreach__F1__V = (function(f) {
  var i = 0;
  var len = this.table$5.u.length;
  while ((i < len)) {
    var curEntry = this.table$5.u[i];
    if ((curEntry !== null)) {
      f.apply__O__O($s_scm_FlatHashTable$HashUtils$class__entryToElem__scm_FlatHashTable$HashUtils__O__O(this, curEntry))
    };
    i = ((1 + i) | 0)
  }
});
$c_scm_HashSet.prototype.size__I = (function() {
  return this.tableSize$5
});
$c_scm_HashSet.prototype.result__O = (function() {
  return this
});
$c_scm_HashSet.prototype.iterator__sc_Iterator = (function() {
  return new $c_scm_FlatHashTable$$anon$1().init___scm_FlatHashTable(this)
});
$c_scm_HashSet.prototype.init___scm_FlatHashTable$Contents = (function(contents) {
  $s_scm_FlatHashTable$class__$$init$__scm_FlatHashTable__V(this);
  $s_scm_FlatHashTable$class__initWithContents__scm_FlatHashTable__scm_FlatHashTable$Contents__V(this, contents);
  return this
});
$c_scm_HashSet.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_HashSet(elem)
});
$c_scm_HashSet.prototype.$$plus__O__sc_Set = (function(elem) {
  var this$1 = new $c_scm_HashSet().init___();
  var this$2 = $as_scm_HashSet($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this$1, this));
  return this$2.$$plus$eq__O__scm_HashSet(elem)
});
$c_scm_HashSet.prototype.$$plus$eq__O__scm_HashSet = (function(elem) {
  $s_scm_FlatHashTable$class__addElem__scm_FlatHashTable__O__Z(this, elem);
  return this
});
function $is_scm_HashSet(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_HashSet)))
}
function $as_scm_HashSet(obj) {
  return (($is_scm_HashSet(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.HashSet"))
}
function $isArrayOf_scm_HashSet(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_HashSet)))
}
function $asArrayOf_scm_HashSet(obj, depth) {
  return (($isArrayOf_scm_HashSet(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.HashSet;", depth))
}
var $d_scm_HashSet = new $TypeData().initClass({
  scm_HashSet: 0
}, false, "scala.collection.mutable.HashSet", {
  scm_HashSet: 1,
  scm_AbstractSet: 1,
  scm_AbstractIterable: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_Set: 1,
  sc_Set: 1,
  F1: 1,
  sc_GenSet: 1,
  sc_GenSetLike: 1,
  scg_GenericSetTemplate: 1,
  sc_SetLike: 1,
  scg_Subtractable: 1,
  scm_SetLike: 1,
  sc_script_Scriptable: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_FlatHashTable: 1,
  scm_FlatHashTable$HashUtils: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_HashSet.prototype.$classData = $d_scm_HashSet;
/** @constructor */
function $c_scm_WrappedArray$ofBoolean() {
  $c_scm_WrappedArray.call(this);
  this.array$6 = null
}
$c_scm_WrappedArray$ofBoolean.prototype = new $h_scm_WrappedArray();
$c_scm_WrappedArray$ofBoolean.prototype.constructor = $c_scm_WrappedArray$ofBoolean;
/** @constructor */
function $h_scm_WrappedArray$ofBoolean() {
  /*<skip>*/
}
$h_scm_WrappedArray$ofBoolean.prototype = $c_scm_WrappedArray$ofBoolean.prototype;
$c_scm_WrappedArray$ofBoolean.prototype.apply__I__O = (function(index) {
  return this.apply$mcZI$sp__I__Z(index)
});
$c_scm_WrappedArray$ofBoolean.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  return this.apply$mcZI$sp__I__Z(index)
});
$c_scm_WrappedArray$ofBoolean.prototype.update__I__O__V = (function(index, elem) {
  this.update__I__Z__V(index, $uZ(elem))
});
$c_scm_WrappedArray$ofBoolean.prototype.apply$mcZI$sp__I__Z = (function(index) {
  return this.array$6.u[index]
});
$c_scm_WrappedArray$ofBoolean.prototype.length__I = (function() {
  return this.array$6.u.length
});
$c_scm_WrappedArray$ofBoolean.prototype.update__I__Z__V = (function(index, elem) {
  this.array$6.u[index] = elem
});
$c_scm_WrappedArray$ofBoolean.prototype.elemTag__s_reflect_ClassTag = (function() {
  return $m_s_reflect_ManifestFactory$BooleanManifest$()
});
$c_scm_WrappedArray$ofBoolean.prototype.init___AZ = (function(array) {
  this.array$6 = array;
  return this
});
$c_scm_WrappedArray$ofBoolean.prototype.array__O = (function() {
  return this.array$6
});
var $d_scm_WrappedArray$ofBoolean = new $TypeData().initClass({
  scm_WrappedArray$ofBoolean: 0
}, false, "scala.collection.mutable.WrappedArray$ofBoolean", {
  scm_WrappedArray$ofBoolean: 1,
  scm_WrappedArray: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_WrappedArray$ofBoolean.prototype.$classData = $d_scm_WrappedArray$ofBoolean;
/** @constructor */
function $c_scm_WrappedArray$ofByte() {
  $c_scm_WrappedArray.call(this);
  this.array$6 = null
}
$c_scm_WrappedArray$ofByte.prototype = new $h_scm_WrappedArray();
$c_scm_WrappedArray$ofByte.prototype.constructor = $c_scm_WrappedArray$ofByte;
/** @constructor */
function $h_scm_WrappedArray$ofByte() {
  /*<skip>*/
}
$h_scm_WrappedArray$ofByte.prototype = $c_scm_WrappedArray$ofByte.prototype;
$c_scm_WrappedArray$ofByte.prototype.apply__I__O = (function(index) {
  return this.apply__I__B(index)
});
$c_scm_WrappedArray$ofByte.prototype.apply__O__O = (function(v1) {
  return this.apply__I__B($uI(v1))
});
$c_scm_WrappedArray$ofByte.prototype.update__I__O__V = (function(index, elem) {
  this.update__I__B__V(index, $uB(elem))
});
$c_scm_WrappedArray$ofByte.prototype.apply__I__B = (function(index) {
  return this.array$6.u[index]
});
$c_scm_WrappedArray$ofByte.prototype.length__I = (function() {
  return this.array$6.u.length
});
$c_scm_WrappedArray$ofByte.prototype.elemTag__s_reflect_ClassTag = (function() {
  return $m_s_reflect_ManifestFactory$ByteManifest$()
});
$c_scm_WrappedArray$ofByte.prototype.array__O = (function() {
  return this.array$6
});
$c_scm_WrappedArray$ofByte.prototype.init___AB = (function(array) {
  this.array$6 = array;
  return this
});
$c_scm_WrappedArray$ofByte.prototype.update__I__B__V = (function(index, elem) {
  this.array$6.u[index] = elem
});
var $d_scm_WrappedArray$ofByte = new $TypeData().initClass({
  scm_WrappedArray$ofByte: 0
}, false, "scala.collection.mutable.WrappedArray$ofByte", {
  scm_WrappedArray$ofByte: 1,
  scm_WrappedArray: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_WrappedArray$ofByte.prototype.$classData = $d_scm_WrappedArray$ofByte;
/** @constructor */
function $c_scm_WrappedArray$ofChar() {
  $c_scm_WrappedArray.call(this);
  this.array$6 = null
}
$c_scm_WrappedArray$ofChar.prototype = new $h_scm_WrappedArray();
$c_scm_WrappedArray$ofChar.prototype.constructor = $c_scm_WrappedArray$ofChar;
/** @constructor */
function $h_scm_WrappedArray$ofChar() {
  /*<skip>*/
}
$h_scm_WrappedArray$ofChar.prototype = $c_scm_WrappedArray$ofChar.prototype;
$c_scm_WrappedArray$ofChar.prototype.apply__I__O = (function(index) {
  var c = this.apply__I__C(index);
  return new $c_jl_Character().init___C(c)
});
$c_scm_WrappedArray$ofChar.prototype.apply__O__O = (function(v1) {
  var c = this.apply__I__C($uI(v1));
  return new $c_jl_Character().init___C(c)
});
$c_scm_WrappedArray$ofChar.prototype.update__I__O__V = (function(index, elem) {
  if ((elem === null)) {
    var jsx$1 = 0
  } else {
    var this$2 = $as_jl_Character(elem);
    var jsx$1 = this$2.value$1
  };
  this.update__I__C__V(index, jsx$1)
});
$c_scm_WrappedArray$ofChar.prototype.apply__I__C = (function(index) {
  return this.array$6.u[index]
});
$c_scm_WrappedArray$ofChar.prototype.update__I__C__V = (function(index, elem) {
  this.array$6.u[index] = elem
});
$c_scm_WrappedArray$ofChar.prototype.init___AC = (function(array) {
  this.array$6 = array;
  return this
});
$c_scm_WrappedArray$ofChar.prototype.length__I = (function() {
  return this.array$6.u.length
});
$c_scm_WrappedArray$ofChar.prototype.elemTag__s_reflect_ClassTag = (function() {
  return $m_s_reflect_ManifestFactory$CharManifest$()
});
$c_scm_WrappedArray$ofChar.prototype.array__O = (function() {
  return this.array$6
});
var $d_scm_WrappedArray$ofChar = new $TypeData().initClass({
  scm_WrappedArray$ofChar: 0
}, false, "scala.collection.mutable.WrappedArray$ofChar", {
  scm_WrappedArray$ofChar: 1,
  scm_WrappedArray: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_WrappedArray$ofChar.prototype.$classData = $d_scm_WrappedArray$ofChar;
/** @constructor */
function $c_scm_WrappedArray$ofDouble() {
  $c_scm_WrappedArray.call(this);
  this.array$6 = null
}
$c_scm_WrappedArray$ofDouble.prototype = new $h_scm_WrappedArray();
$c_scm_WrappedArray$ofDouble.prototype.constructor = $c_scm_WrappedArray$ofDouble;
/** @constructor */
function $h_scm_WrappedArray$ofDouble() {
  /*<skip>*/
}
$h_scm_WrappedArray$ofDouble.prototype = $c_scm_WrappedArray$ofDouble.prototype;
$c_scm_WrappedArray$ofDouble.prototype.apply__I__O = (function(index) {
  return this.apply$mcDI$sp__I__D(index)
});
$c_scm_WrappedArray$ofDouble.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  return this.apply$mcDI$sp__I__D(index)
});
$c_scm_WrappedArray$ofDouble.prototype.update__I__O__V = (function(index, elem) {
  this.update__I__D__V(index, $uD(elem))
});
$c_scm_WrappedArray$ofDouble.prototype.init___AD = (function(array) {
  this.array$6 = array;
  return this
});
$c_scm_WrappedArray$ofDouble.prototype.length__I = (function() {
  return this.array$6.u.length
});
$c_scm_WrappedArray$ofDouble.prototype.update__I__D__V = (function(index, elem) {
  this.array$6.u[index] = elem
});
$c_scm_WrappedArray$ofDouble.prototype.elemTag__s_reflect_ClassTag = (function() {
  return $m_s_reflect_ManifestFactory$DoubleManifest$()
});
$c_scm_WrappedArray$ofDouble.prototype.array__O = (function() {
  return this.array$6
});
$c_scm_WrappedArray$ofDouble.prototype.apply$mcDI$sp__I__D = (function(index) {
  return this.array$6.u[index]
});
var $d_scm_WrappedArray$ofDouble = new $TypeData().initClass({
  scm_WrappedArray$ofDouble: 0
}, false, "scala.collection.mutable.WrappedArray$ofDouble", {
  scm_WrappedArray$ofDouble: 1,
  scm_WrappedArray: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_WrappedArray$ofDouble.prototype.$classData = $d_scm_WrappedArray$ofDouble;
/** @constructor */
function $c_scm_WrappedArray$ofFloat() {
  $c_scm_WrappedArray.call(this);
  this.array$6 = null
}
$c_scm_WrappedArray$ofFloat.prototype = new $h_scm_WrappedArray();
$c_scm_WrappedArray$ofFloat.prototype.constructor = $c_scm_WrappedArray$ofFloat;
/** @constructor */
function $h_scm_WrappedArray$ofFloat() {
  /*<skip>*/
}
$h_scm_WrappedArray$ofFloat.prototype = $c_scm_WrappedArray$ofFloat.prototype;
$c_scm_WrappedArray$ofFloat.prototype.apply__I__O = (function(index) {
  return this.apply$mcFI$sp__I__F(index)
});
$c_scm_WrappedArray$ofFloat.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  return this.apply$mcFI$sp__I__F(index)
});
$c_scm_WrappedArray$ofFloat.prototype.update__I__O__V = (function(index, elem) {
  this.update__I__F__V(index, $uF(elem))
});
$c_scm_WrappedArray$ofFloat.prototype.init___AF = (function(array) {
  this.array$6 = array;
  return this
});
$c_scm_WrappedArray$ofFloat.prototype.apply$mcFI$sp__I__F = (function(index) {
  return this.array$6.u[index]
});
$c_scm_WrappedArray$ofFloat.prototype.length__I = (function() {
  return this.array$6.u.length
});
$c_scm_WrappedArray$ofFloat.prototype.update__I__F__V = (function(index, elem) {
  this.array$6.u[index] = elem
});
$c_scm_WrappedArray$ofFloat.prototype.elemTag__s_reflect_ClassTag = (function() {
  return $m_s_reflect_ManifestFactory$FloatManifest$()
});
$c_scm_WrappedArray$ofFloat.prototype.array__O = (function() {
  return this.array$6
});
var $d_scm_WrappedArray$ofFloat = new $TypeData().initClass({
  scm_WrappedArray$ofFloat: 0
}, false, "scala.collection.mutable.WrappedArray$ofFloat", {
  scm_WrappedArray$ofFloat: 1,
  scm_WrappedArray: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_WrappedArray$ofFloat.prototype.$classData = $d_scm_WrappedArray$ofFloat;
/** @constructor */
function $c_scm_WrappedArray$ofInt() {
  $c_scm_WrappedArray.call(this);
  this.array$6 = null
}
$c_scm_WrappedArray$ofInt.prototype = new $h_scm_WrappedArray();
$c_scm_WrappedArray$ofInt.prototype.constructor = $c_scm_WrappedArray$ofInt;
/** @constructor */
function $h_scm_WrappedArray$ofInt() {
  /*<skip>*/
}
$h_scm_WrappedArray$ofInt.prototype = $c_scm_WrappedArray$ofInt.prototype;
$c_scm_WrappedArray$ofInt.prototype.apply__I__O = (function(index) {
  return this.apply$mcII$sp__I__I(index)
});
$c_scm_WrappedArray$ofInt.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  return this.apply$mcII$sp__I__I(index)
});
$c_scm_WrappedArray$ofInt.prototype.update__I__O__V = (function(index, elem) {
  this.update__I__I__V(index, $uI(elem))
});
$c_scm_WrappedArray$ofInt.prototype.update__I__I__V = (function(index, elem) {
  this.array$6.u[index] = elem
});
$c_scm_WrappedArray$ofInt.prototype.apply$mcII$sp__I__I = (function(index) {
  return this.array$6.u[index]
});
$c_scm_WrappedArray$ofInt.prototype.init___AI = (function(array) {
  this.array$6 = array;
  return this
});
$c_scm_WrappedArray$ofInt.prototype.length__I = (function() {
  return this.array$6.u.length
});
$c_scm_WrappedArray$ofInt.prototype.elemTag__s_reflect_ClassTag = (function() {
  return $m_s_reflect_ManifestFactory$IntManifest$()
});
$c_scm_WrappedArray$ofInt.prototype.array__O = (function() {
  return this.array$6
});
function $is_scm_WrappedArray$ofInt(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_WrappedArray$ofInt)))
}
function $as_scm_WrappedArray$ofInt(obj) {
  return (($is_scm_WrappedArray$ofInt(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.WrappedArray$ofInt"))
}
function $isArrayOf_scm_WrappedArray$ofInt(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_WrappedArray$ofInt)))
}
function $asArrayOf_scm_WrappedArray$ofInt(obj, depth) {
  return (($isArrayOf_scm_WrappedArray$ofInt(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.WrappedArray$ofInt;", depth))
}
var $d_scm_WrappedArray$ofInt = new $TypeData().initClass({
  scm_WrappedArray$ofInt: 0
}, false, "scala.collection.mutable.WrappedArray$ofInt", {
  scm_WrappedArray$ofInt: 1,
  scm_WrappedArray: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_WrappedArray$ofInt.prototype.$classData = $d_scm_WrappedArray$ofInt;
/** @constructor */
function $c_scm_WrappedArray$ofLong() {
  $c_scm_WrappedArray.call(this);
  this.array$6 = null
}
$c_scm_WrappedArray$ofLong.prototype = new $h_scm_WrappedArray();
$c_scm_WrappedArray$ofLong.prototype.constructor = $c_scm_WrappedArray$ofLong;
/** @constructor */
function $h_scm_WrappedArray$ofLong() {
  /*<skip>*/
}
$h_scm_WrappedArray$ofLong.prototype = $c_scm_WrappedArray$ofLong.prototype;
$c_scm_WrappedArray$ofLong.prototype.apply__I__O = (function(index) {
  return this.apply$mcJI$sp__I__J(index)
});
$c_scm_WrappedArray$ofLong.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  return this.apply$mcJI$sp__I__J(index)
});
$c_scm_WrappedArray$ofLong.prototype.init___AJ = (function(array) {
  this.array$6 = array;
  return this
});
$c_scm_WrappedArray$ofLong.prototype.update__I__O__V = (function(index, elem) {
  this.update__I__J__V(index, $uJ(elem))
});
$c_scm_WrappedArray$ofLong.prototype.length__I = (function() {
  return this.array$6.u.length
});
$c_scm_WrappedArray$ofLong.prototype.update__I__J__V = (function(index, elem) {
  this.array$6.u[index] = elem
});
$c_scm_WrappedArray$ofLong.prototype.elemTag__s_reflect_ClassTag = (function() {
  return $m_s_reflect_ManifestFactory$LongManifest$()
});
$c_scm_WrappedArray$ofLong.prototype.array__O = (function() {
  return this.array$6
});
$c_scm_WrappedArray$ofLong.prototype.apply$mcJI$sp__I__J = (function(index) {
  return this.array$6.u[index]
});
var $d_scm_WrappedArray$ofLong = new $TypeData().initClass({
  scm_WrappedArray$ofLong: 0
}, false, "scala.collection.mutable.WrappedArray$ofLong", {
  scm_WrappedArray$ofLong: 1,
  scm_WrappedArray: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_WrappedArray$ofLong.prototype.$classData = $d_scm_WrappedArray$ofLong;
/** @constructor */
function $c_scm_WrappedArray$ofRef() {
  $c_scm_WrappedArray.call(this);
  this.array$6 = null;
  this.elemTag$6 = null;
  this.bitmap$0$6 = false
}
$c_scm_WrappedArray$ofRef.prototype = new $h_scm_WrappedArray();
$c_scm_WrappedArray$ofRef.prototype.constructor = $c_scm_WrappedArray$ofRef;
/** @constructor */
function $h_scm_WrappedArray$ofRef() {
  /*<skip>*/
}
$h_scm_WrappedArray$ofRef.prototype = $c_scm_WrappedArray$ofRef.prototype;
$c_scm_WrappedArray$ofRef.prototype.apply__O__O = (function(v1) {
  return this.apply__I__O($uI(v1))
});
$c_scm_WrappedArray$ofRef.prototype.apply__I__O = (function(index) {
  return this.array$6.u[index]
});
$c_scm_WrappedArray$ofRef.prototype.update__I__O__V = (function(index, elem) {
  this.array$6.u[index] = elem
});
$c_scm_WrappedArray$ofRef.prototype.elemTag$lzycompute__p6__s_reflect_ClassTag = (function() {
  if ((!this.bitmap$0$6)) {
    var jsx$1 = $m_s_reflect_ClassTag$();
    var this$1 = this.array$6;
    var schematic = $objectGetClass(this$1);
    this.elemTag$6 = jsx$1.apply__jl_Class__s_reflect_ClassTag(schematic.getComponentType__jl_Class());
    this.bitmap$0$6 = true
  };
  return this.elemTag$6
});
$c_scm_WrappedArray$ofRef.prototype.init___AO = (function(array) {
  this.array$6 = array;
  return this
});
$c_scm_WrappedArray$ofRef.prototype.length__I = (function() {
  return this.array$6.u.length
});
$c_scm_WrappedArray$ofRef.prototype.elemTag__s_reflect_ClassTag = (function() {
  return ((!this.bitmap$0$6) ? this.elemTag$lzycompute__p6__s_reflect_ClassTag() : this.elemTag$6)
});
$c_scm_WrappedArray$ofRef.prototype.array__O = (function() {
  return this.array$6
});
function $is_scm_WrappedArray$ofRef(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_WrappedArray$ofRef)))
}
function $as_scm_WrappedArray$ofRef(obj) {
  return (($is_scm_WrappedArray$ofRef(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.WrappedArray$ofRef"))
}
function $isArrayOf_scm_WrappedArray$ofRef(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_WrappedArray$ofRef)))
}
function $asArrayOf_scm_WrappedArray$ofRef(obj, depth) {
  return (($isArrayOf_scm_WrappedArray$ofRef(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.WrappedArray$ofRef;", depth))
}
var $d_scm_WrappedArray$ofRef = new $TypeData().initClass({
  scm_WrappedArray$ofRef: 0
}, false, "scala.collection.mutable.WrappedArray$ofRef", {
  scm_WrappedArray$ofRef: 1,
  scm_WrappedArray: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_WrappedArray$ofRef.prototype.$classData = $d_scm_WrappedArray$ofRef;
/** @constructor */
function $c_scm_WrappedArray$ofShort() {
  $c_scm_WrappedArray.call(this);
  this.array$6 = null
}
$c_scm_WrappedArray$ofShort.prototype = new $h_scm_WrappedArray();
$c_scm_WrappedArray$ofShort.prototype.constructor = $c_scm_WrappedArray$ofShort;
/** @constructor */
function $h_scm_WrappedArray$ofShort() {
  /*<skip>*/
}
$h_scm_WrappedArray$ofShort.prototype = $c_scm_WrappedArray$ofShort.prototype;
$c_scm_WrappedArray$ofShort.prototype.apply__I__O = (function(index) {
  return this.apply__I__S(index)
});
$c_scm_WrappedArray$ofShort.prototype.apply__O__O = (function(v1) {
  return this.apply__I__S($uI(v1))
});
$c_scm_WrappedArray$ofShort.prototype.init___AS = (function(array) {
  this.array$6 = array;
  return this
});
$c_scm_WrappedArray$ofShort.prototype.update__I__O__V = (function(index, elem) {
  this.update__I__S__V(index, $uS(elem))
});
$c_scm_WrappedArray$ofShort.prototype.update__I__S__V = (function(index, elem) {
  this.array$6.u[index] = elem
});
$c_scm_WrappedArray$ofShort.prototype.length__I = (function() {
  return this.array$6.u.length
});
$c_scm_WrappedArray$ofShort.prototype.elemTag__s_reflect_ClassTag = (function() {
  return $m_s_reflect_ManifestFactory$ShortManifest$()
});
$c_scm_WrappedArray$ofShort.prototype.array__O = (function() {
  return this.array$6
});
$c_scm_WrappedArray$ofShort.prototype.apply__I__S = (function(index) {
  return this.array$6.u[index]
});
var $d_scm_WrappedArray$ofShort = new $TypeData().initClass({
  scm_WrappedArray$ofShort: 0
}, false, "scala.collection.mutable.WrappedArray$ofShort", {
  scm_WrappedArray$ofShort: 1,
  scm_WrappedArray: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_WrappedArray$ofShort.prototype.$classData = $d_scm_WrappedArray$ofShort;
/** @constructor */
function $c_scm_WrappedArray$ofUnit() {
  $c_scm_WrappedArray.call(this);
  this.array$6 = null
}
$c_scm_WrappedArray$ofUnit.prototype = new $h_scm_WrappedArray();
$c_scm_WrappedArray$ofUnit.prototype.constructor = $c_scm_WrappedArray$ofUnit;
/** @constructor */
function $h_scm_WrappedArray$ofUnit() {
  /*<skip>*/
}
$h_scm_WrappedArray$ofUnit.prototype = $c_scm_WrappedArray$ofUnit.prototype;
$c_scm_WrappedArray$ofUnit.prototype.apply__I__O = (function(index) {
  this.apply$mcVI$sp__I__V(index)
});
$c_scm_WrappedArray$ofUnit.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  this.apply$mcVI$sp__I__V(index)
});
$c_scm_WrappedArray$ofUnit.prototype.apply$mcVI$sp__I__V = (function(index) {
  this.array$6.u[index]
});
$c_scm_WrappedArray$ofUnit.prototype.update__I__O__V = (function(index, elem) {
  this.update__I__sr_BoxedUnit__V(index, $asUnit(elem))
});
$c_scm_WrappedArray$ofUnit.prototype.length__I = (function() {
  return this.array$6.u.length
});
$c_scm_WrappedArray$ofUnit.prototype.init___Asr_BoxedUnit = (function(array) {
  this.array$6 = array;
  return this
});
$c_scm_WrappedArray$ofUnit.prototype.elemTag__s_reflect_ClassTag = (function() {
  return $m_s_reflect_ManifestFactory$UnitManifest$()
});
$c_scm_WrappedArray$ofUnit.prototype.array__O = (function() {
  return this.array$6
});
$c_scm_WrappedArray$ofUnit.prototype.update__I__sr_BoxedUnit__V = (function(index, elem) {
  this.array$6.u[index] = elem
});
var $d_scm_WrappedArray$ofUnit = new $TypeData().initClass({
  scm_WrappedArray$ofUnit: 0
}, false, "scala.collection.mutable.WrappedArray$ofUnit", {
  scm_WrappedArray$ofUnit: 1,
  scm_WrappedArray: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_WrappedArray$ofUnit.prototype.$classData = $d_scm_WrappedArray$ofUnit;
/** @constructor */
function $c_scm_ListBuffer() {
  $c_scm_AbstractBuffer.call(this);
  this.scala$collection$mutable$ListBuffer$$start$6 = null;
  this.last0$6 = null;
  this.exported$6 = false;
  this.len$6 = 0
}
$c_scm_ListBuffer.prototype = new $h_scm_AbstractBuffer();
$c_scm_ListBuffer.prototype.constructor = $c_scm_ListBuffer;
/** @constructor */
function $h_scm_ListBuffer() {
  /*<skip>*/
}
$h_scm_ListBuffer.prototype = $c_scm_ListBuffer.prototype;
$c_scm_ListBuffer.prototype.copy__p6__V = (function() {
  if (this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z()) {
    return (void 0)
  };
  var cursor = this.scala$collection$mutable$ListBuffer$$start$6;
  var this$1 = this.last0$6;
  var limit = this$1.tl$5;
  this.clear__V();
  while ((cursor !== limit)) {
    this.$$plus$eq__O__scm_ListBuffer(cursor.head__O());
    cursor = $as_sci_List(cursor.tail__O())
  }
});
$c_scm_ListBuffer.prototype.init___ = (function() {
  this.scala$collection$mutable$ListBuffer$$start$6 = $m_sci_Nil$();
  this.exported$6 = false;
  this.len$6 = 0;
  return this
});
$c_scm_ListBuffer.prototype.head__O = (function() {
  return this.scala$collection$mutable$ListBuffer$$start$6.head__O()
});
$c_scm_ListBuffer.prototype.apply__I__O = (function(n) {
  if (((n < 0) || (n >= this.len$6))) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
  } else {
    var this$2 = this.scala$collection$mutable$ListBuffer$$start$6;
    return $s_sc_LinearSeqOptimized$class__apply__sc_LinearSeqOptimized__I__O(this$2, n)
  }
});
$c_scm_ListBuffer.prototype.lengthCompare__I__I = (function(len) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_LinearSeqOptimized$class__lengthCompare__sc_LinearSeqOptimized__I__I(this$1, len)
});
$c_scm_ListBuffer.prototype.apply__O__O = (function(v1) {
  return this.apply__I__O($uI(v1))
});
$c_scm_ListBuffer.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_LinearSeqOptimized$class__sameElements__sc_LinearSeqOptimized__sc_GenIterable__Z(this$1, that)
});
$c_scm_ListBuffer.prototype.indices__sci_Range = (function() {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_SeqLike$class__indices__sc_SeqLike__sci_Range(this$1)
});
$c_scm_ListBuffer.prototype.isEmpty__Z = (function() {
  return this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z()
});
$c_scm_ListBuffer.prototype.toList__sci_List = (function() {
  this.exported$6 = (!this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z());
  return this.scala$collection$mutable$ListBuffer$$start$6
});
$c_scm_ListBuffer.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_ListBuffer.prototype.equals__O__Z = (function(that) {
  if ($is_scm_ListBuffer(that)) {
    var x2 = $as_scm_ListBuffer(that);
    return this.scala$collection$mutable$ListBuffer$$start$6.equals__O__Z(x2.scala$collection$mutable$ListBuffer$$start$6)
  } else {
    return $s_sc_GenSeqLike$class__equals__sc_GenSeqLike__O__Z(this, that)
  }
});
$c_scm_ListBuffer.prototype.mkString__T__T__T__T = (function(start, sep, end) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_TraversableOnce$class__mkString__sc_TraversableOnce__T__T__T__T(this$1, start, sep, end)
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_ListBuffer(elem)
});
$c_scm_ListBuffer.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_ListBuffer$()
});
$c_scm_ListBuffer.prototype.foreach__F1__V = (function(f) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  var these = this$1;
  while ((!these.isEmpty__Z())) {
    f.apply__O__O(these.head__O());
    these = $as_sci_List(these.tail__O())
  }
});
$c_scm_ListBuffer.prototype.size__I = (function() {
  return this.len$6
});
$c_scm_ListBuffer.prototype.result__O = (function() {
  return this.toList__sci_List()
});
$c_scm_ListBuffer.prototype.iterator__sc_Iterator = (function() {
  return new $c_scm_ListBuffer$$anon$1().init___scm_ListBuffer(this)
});
$c_scm_ListBuffer.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_ListBuffer.prototype.length__I = (function() {
  return this.len$6
});
$c_scm_ListBuffer.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_ListBuffer.prototype.remove__I__O = (function(n) {
  if (((n < 0) || (n >= this.len$6))) {
    throw new $c_jl_IndexOutOfBoundsException().init___T(("" + n))
  };
  if (this.exported$6) {
    this.copy__p6__V()
  };
  var old = this.scala$collection$mutable$ListBuffer$$start$6.head__O();
  if ((n === 0)) {
    this.scala$collection$mutable$ListBuffer$$start$6 = $as_sci_List(this.scala$collection$mutable$ListBuffer$$start$6.tail__O())
  } else {
    var cursor = this.scala$collection$mutable$ListBuffer$$start$6;
    var i = 1;
    while ((i < n)) {
      cursor = $as_sci_List(cursor.tail__O());
      i = ((1 + i) | 0)
    };
    old = $as_sc_IterableLike(cursor.tail__O()).head__O();
    if ((this.last0$6 === cursor.tail__O())) {
      this.last0$6 = $as_sci_$colon$colon(cursor)
    };
    $as_sci_$colon$colon(cursor).tl$5 = $as_sci_List($as_sc_TraversableLike(cursor.tail__O()).tail__O())
  };
  this.reduceLengthBy__p6__I__V(1);
  return old
});
$c_scm_ListBuffer.prototype.$$minus$eq__O__scm_ListBuffer = (function(elem) {
  if (this.exported$6) {
    this.copy__p6__V()
  };
  if ((!this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z())) {
    if ($m_sr_BoxesRunTime$().equals__O__O__Z(this.scala$collection$mutable$ListBuffer$$start$6.head__O(), elem)) {
      this.scala$collection$mutable$ListBuffer$$start$6 = $as_sci_List(this.scala$collection$mutable$ListBuffer$$start$6.tail__O());
      this.reduceLengthBy__p6__I__V(1)
    } else {
      var cursor = this.scala$collection$mutable$ListBuffer$$start$6;
      while (((!$as_sc_SeqLike(cursor.tail__O()).isEmpty__Z()) && (!$m_sr_BoxesRunTime$().equals__O__O__Z($as_sc_IterableLike(cursor.tail__O()).head__O(), elem)))) {
        cursor = $as_sci_List(cursor.tail__O())
      };
      if ((!$as_sc_SeqLike(cursor.tail__O()).isEmpty__Z())) {
        var z = $as_sci_$colon$colon(cursor);
        var x = z.tl$5;
        var x$2 = this.last0$6;
        if (((x === null) ? (x$2 === null) : x.equals__O__Z(x$2))) {
          this.last0$6 = z
        };
        z.tl$5 = $as_sci_List($as_sc_TraversableLike(cursor.tail__O()).tail__O());
        this.reduceLengthBy__p6__I__V(1)
      }
    }
  };
  return this
});
$c_scm_ListBuffer.prototype.toStream__sci_Stream = (function() {
  return this.scala$collection$mutable$ListBuffer$$start$6.toStream__sci_Stream()
});
$c_scm_ListBuffer.prototype.reduceLengthBy__p6__I__V = (function(num) {
  this.len$6 = ((this.len$6 - num) | 0);
  if ((this.len$6 <= 0)) {
    this.last0$6 = null
  }
});
$c_scm_ListBuffer.prototype.addString__scm_StringBuilder__T__T__T__scm_StringBuilder = (function(b, start, sep, end) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  return $s_sc_TraversableOnce$class__addString__sc_TraversableOnce__scm_StringBuilder__T__T__T__scm_StringBuilder(this$1, b, start, sep, end)
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scm_ListBuffer = (function(x) {
  if (this.exported$6) {
    this.copy__p6__V()
  };
  if (this.scala$collection$mutable$ListBuffer$$start$6.isEmpty__Z()) {
    this.last0$6 = new $c_sci_$colon$colon().init___O__sci_List(x, $m_sci_Nil$());
    this.scala$collection$mutable$ListBuffer$$start$6 = this.last0$6
  } else {
    var last1 = this.last0$6;
    this.last0$6 = new $c_sci_$colon$colon().init___O__sci_List(x, $m_sci_Nil$());
    last1.tl$5 = this.last0$6
  };
  this.len$6 = ((1 + this.len$6) | 0);
  return this
});
$c_scm_ListBuffer.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_ListBuffer(elem)
});
$c_scm_ListBuffer.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_ListBuffer.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  var this$1 = this.scala$collection$mutable$ListBuffer$$start$6;
  $s_sc_IterableLike$class__copyToArray__sc_IterableLike__O__I__I__V(this$1, xs, start, len)
});
$c_scm_ListBuffer.prototype.clear__V = (function() {
  this.scala$collection$mutable$ListBuffer$$start$6 = $m_sci_Nil$();
  this.last0$6 = null;
  this.exported$6 = false;
  this.len$6 = 0
});
$c_scm_ListBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer = (function(xs) {
  _$plus$plus$eq: while (true) {
    var x1 = xs;
    if ((x1 !== null)) {
      if ((x1 === this)) {
        var n = this.len$6;
        xs = $as_sc_TraversableOnce($s_sc_IterableLike$class__take__sc_IterableLike__I__O(this, n));
        continue _$plus$plus$eq
      }
    };
    return $as_scm_ListBuffer($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs))
  }
});
$c_scm_ListBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_ListBuffer(xs)
});
$c_scm_ListBuffer.prototype.stringPrefix__T = (function() {
  return "ListBuffer"
});
function $is_scm_ListBuffer(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ListBuffer)))
}
function $as_scm_ListBuffer(obj) {
  return (($is_scm_ListBuffer(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ListBuffer"))
}
function $isArrayOf_scm_ListBuffer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ListBuffer)))
}
function $asArrayOf_scm_ListBuffer(obj, depth) {
  return (($isArrayOf_scm_ListBuffer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ListBuffer;", depth))
}
var $d_scm_ListBuffer = new $TypeData().initClass({
  scm_ListBuffer: 0
}, false, "scala.collection.mutable.ListBuffer", {
  scm_ListBuffer: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_Builder: 1,
  scg_SeqForwarder: 1,
  scg_IterableForwarder: 1,
  scg_TraversableForwarder: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ListBuffer.prototype.$classData = $d_scm_ListBuffer;
/** @constructor */
function $c_scm_StringBuilder() {
  $c_scm_AbstractSeq.call(this);
  this.underlying$5 = null
}
$c_scm_StringBuilder.prototype = new $h_scm_AbstractSeq();
$c_scm_StringBuilder.prototype.constructor = $c_scm_StringBuilder;
/** @constructor */
function $h_scm_StringBuilder() {
  /*<skip>*/
}
$h_scm_StringBuilder.prototype = $c_scm_StringBuilder.prototype;
$c_scm_StringBuilder.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_StringBuilder.prototype.init___ = (function() {
  $c_scm_StringBuilder.prototype.init___I__T.call(this, 16, "");
  return this
});
$c_scm_StringBuilder.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_scm_StringBuilder.prototype.$$plus$eq__C__scm_StringBuilder = (function(x) {
  this.append__C__scm_StringBuilder(x);
  return this
});
$c_scm_StringBuilder.prototype.apply__I__O = (function(idx) {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  var c = (65535 & $uI(thiz.charCodeAt(idx)));
  return new $c_jl_Character().init___C(c)
});
$c_scm_StringBuilder.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_scm_StringBuilder.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_scm_StringBuilder.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  var c = (65535 & $uI(thiz.charCodeAt(index)));
  return new $c_jl_Character().init___C(c)
});
$c_scm_StringBuilder.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_scm_StringBuilder.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_StringBuilder.prototype.subSequence__I__I__jl_CharSequence = (function(start, end) {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  return $as_T(thiz.substring(start, end))
});
$c_scm_StringBuilder.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  if ((elem === null)) {
    var jsx$1 = 0
  } else {
    var this$2 = $as_jl_Character(elem);
    var jsx$1 = this$2.value$1
  };
  return this.$$plus$eq__C__scm_StringBuilder(jsx$1)
});
$c_scm_StringBuilder.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_IndexedSeq$()
});
$c_scm_StringBuilder.prototype.toString__T = (function() {
  var this$1 = this.underlying$5;
  return this$1.content$1
});
$c_scm_StringBuilder.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_scm_StringBuilder.prototype.slice__I__I__O = (function(from, until) {
  return $s_sci_StringLike$class__slice__sci_StringLike__I__I__O(this, from, until)
});
$c_scm_StringBuilder.prototype.result__O = (function() {
  var this$1 = this.underlying$5;
  return this$1.content$1
});
$c_scm_StringBuilder.prototype.append__T__scm_StringBuilder = (function(s) {
  this.underlying$5.append__T__jl_StringBuilder(s);
  return this
});
$c_scm_StringBuilder.prototype.iterator__sc_Iterator = (function() {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(thiz.length))
});
$c_scm_StringBuilder.prototype.seq__scm_Seq = (function() {
  return this
});
$c_scm_StringBuilder.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_StringBuilder.prototype.init___I__T = (function(initCapacity, initValue) {
  $c_scm_StringBuilder.prototype.init___jl_StringBuilder.call(this, new $c_jl_StringBuilder().init___I((($uI(initValue.length) + initCapacity) | 0)).append__T__jl_StringBuilder(initValue));
  return this
});
$c_scm_StringBuilder.prototype.length__I = (function() {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  return $uI(thiz.length)
});
$c_scm_StringBuilder.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_StringBuilder.prototype.drop__I__O = (function(n) {
  var this$1 = this.underlying$5;
  var thiz = this$1.content$1;
  var until = $uI(thiz.length);
  return $s_sci_StringLike$class__slice__sci_StringLike__I__I__O(this, n, until)
});
$c_scm_StringBuilder.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_scm_StringBuilder.prototype.init___jl_StringBuilder = (function(underlying) {
  this.underlying$5 = underlying;
  return this
});
$c_scm_StringBuilder.prototype.append__O__scm_StringBuilder = (function(x) {
  this.underlying$5.append__T__jl_StringBuilder($m_sjsr_RuntimeString$().valueOf__O__T(x));
  return this
});
$c_scm_StringBuilder.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  if ((elem === null)) {
    var jsx$1 = 0
  } else {
    var this$2 = $as_jl_Character(elem);
    var jsx$1 = this$2.value$1
  };
  return this.$$plus$eq__C__scm_StringBuilder(jsx$1)
});
$c_scm_StringBuilder.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_scm_StringBuilder.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_scm_StringBuilder.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_scm_StringBuilder.prototype.append__C__scm_StringBuilder = (function(x) {
  this.underlying$5.append__C__jl_StringBuilder(x);
  return this
});
$c_scm_StringBuilder.prototype.newBuilder__scm_Builder = (function() {
  return new $c_scm_GrowingBuilder().init___scg_Growable(new $c_scm_StringBuilder().init___())
});
$c_scm_StringBuilder.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return $s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs)
});
var $d_scm_StringBuilder = new $TypeData().initClass({
  scm_StringBuilder: 0
}, false, "scala.collection.mutable.StringBuilder", {
  scm_StringBuilder: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  jl_CharSequence: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  sci_StringLike: 1,
  sc_IndexedSeqOptimized: 1,
  s_math_Ordered: 1,
  jl_Comparable: 1,
  scm_Builder: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_StringBuilder.prototype.$classData = $d_scm_StringBuilder;
/** @constructor */
function $c_sjs_js_WrappedArray() {
  $c_scm_AbstractBuffer.call(this);
  this.array$6 = null
}
$c_sjs_js_WrappedArray.prototype = new $h_scm_AbstractBuffer();
$c_sjs_js_WrappedArray.prototype.constructor = $c_sjs_js_WrappedArray;
/** @constructor */
function $h_sjs_js_WrappedArray() {
  /*<skip>*/
}
$h_sjs_js_WrappedArray.prototype = $c_sjs_js_WrappedArray.prototype;
$c_sjs_js_WrappedArray.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.init___ = (function() {
  $c_sjs_js_WrappedArray.prototype.init___sjs_js_Array.call(this, []);
  return this
});
$c_sjs_js_WrappedArray.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_sjs_js_WrappedArray.prototype.apply__I__O = (function(index) {
  return this.array$6[index]
});
$c_sjs_js_WrappedArray.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_sjs_js_WrappedArray.prototype.apply__O__O = (function(v1) {
  var index = $uI(v1);
  return this.array$6[index]
});
$c_sjs_js_WrappedArray.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_sjs_js_WrappedArray.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_sjs_js_WrappedArray.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  this.array$6.push(elem);
  return this
});
$c_sjs_js_WrappedArray.prototype.companion__scg_GenericCompanion = (function() {
  return $m_sjs_js_WrappedArray$()
});
$c_sjs_js_WrappedArray.prototype.foreach__F1__V = (function(f) {
  $s_sc_IndexedSeqOptimized$class__foreach__sc_IndexedSeqOptimized__F1__V(this, f)
});
$c_sjs_js_WrappedArray.prototype.slice__I__I__O = (function(from, until) {
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, from, until)
});
$c_sjs_js_WrappedArray.prototype.result__O = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.seq__scm_Seq = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, $uI(this.array$6.length))
});
$c_sjs_js_WrappedArray.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_sjs_js_WrappedArray.prototype.seq__sc_Seq = (function() {
  return this
});
$c_sjs_js_WrappedArray.prototype.length__I = (function() {
  return $uI(this.array$6.length)
});
$c_sjs_js_WrappedArray.prototype.drop__I__O = (function(n) {
  var until = $uI(this.array$6.length);
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, n, until)
});
$c_sjs_js_WrappedArray.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_sjs_js_WrappedArray.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  this.array$6.push(elem);
  return this
});
$c_sjs_js_WrappedArray.prototype.sizeHint__I__V = (function(size) {
  /*<skip>*/
});
$c_sjs_js_WrappedArray.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_sc_IndexedSeqOptimized$class__copyToArray__sc_IndexedSeqOptimized__O__I__I__V(this, xs, start, len)
});
$c_sjs_js_WrappedArray.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_sjs_js_WrappedArray.prototype.init___sjs_js_Array = (function(array) {
  this.array$6 = array;
  return this
});
$c_sjs_js_WrappedArray.prototype.stringPrefix__T = (function() {
  return "WrappedArray"
});
var $d_sjs_js_WrappedArray = new $TypeData().initClass({
  sjs_js_WrappedArray: 0
}, false, "scala.scalajs.js.WrappedArray", {
  sjs_js_WrappedArray: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_IndexedSeqLike: 1,
  scm_IndexedSeqLike: 1,
  scm_ArrayLike: 1,
  scm_IndexedSeqOptimized: 1,
  sc_IndexedSeqOptimized: 1,
  scm_Builder: 1
});
$c_sjs_js_WrappedArray.prototype.$classData = $d_sjs_js_WrappedArray;
/** @constructor */
function $c_scm_ArrayBuffer() {
  $c_scm_AbstractBuffer.call(this);
  this.initialSize$6 = 0;
  this.array$6 = null;
  this.size0$6 = 0
}
$c_scm_ArrayBuffer.prototype = new $h_scm_AbstractBuffer();
$c_scm_ArrayBuffer.prototype.constructor = $c_scm_ArrayBuffer;
/** @constructor */
function $h_scm_ArrayBuffer() {
  /*<skip>*/
}
$h_scm_ArrayBuffer.prototype = $c_scm_ArrayBuffer.prototype;
$c_scm_ArrayBuffer.prototype.seq__sc_TraversableOnce = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scm_ArrayBuffer = (function(elem) {
  var n = ((1 + this.size0$6) | 0);
  $s_scm_ResizableArray$class__ensureSize__scm_ResizableArray__I__V(this, n);
  this.array$6.u[this.size0$6] = elem;
  this.size0$6 = ((1 + this.size0$6) | 0);
  return this
});
$c_scm_ArrayBuffer.prototype.init___ = (function() {
  $c_scm_ArrayBuffer.prototype.init___I.call(this, 16);
  return this
});
$c_scm_ArrayBuffer.prototype.head__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__head__sc_IndexedSeqOptimized__O(this)
});
$c_scm_ArrayBuffer.prototype.apply__I__O = (function(idx) {
  return $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(this, idx)
});
$c_scm_ArrayBuffer.prototype.lengthCompare__I__I = (function(len) {
  return $s_sc_IndexedSeqOptimized$class__lengthCompare__sc_IndexedSeqOptimized__I__I(this, len)
});
$c_scm_ArrayBuffer.prototype.sameElements__sc_GenIterable__Z = (function(that) {
  return $s_sc_IndexedSeqOptimized$class__sameElements__sc_IndexedSeqOptimized__sc_GenIterable__Z(this, that)
});
$c_scm_ArrayBuffer.prototype.apply__O__O = (function(v1) {
  var idx = $uI(v1);
  return $s_scm_ResizableArray$class__apply__scm_ResizableArray__I__O(this, idx)
});
$c_scm_ArrayBuffer.prototype.isEmpty__Z = (function() {
  return $s_sc_IndexedSeqOptimized$class__isEmpty__sc_IndexedSeqOptimized__Z(this)
});
$c_scm_ArrayBuffer.prototype.thisCollection__sc_Traversable = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scg_Growable = (function(elem) {
  return this.$$plus$eq__O__scm_ArrayBuffer(elem)
});
$c_scm_ArrayBuffer.prototype.companion__scg_GenericCompanion = (function() {
  return $m_scm_ArrayBuffer$()
});
$c_scm_ArrayBuffer.prototype.foreach__F1__V = (function(f) {
  $s_scm_ResizableArray$class__foreach__scm_ResizableArray__F1__V(this, f)
});
$c_scm_ArrayBuffer.prototype.slice__I__I__O = (function(from, until) {
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, from, until)
});
$c_scm_ArrayBuffer.prototype.result__O = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.iterator__sc_Iterator = (function() {
  return new $c_sc_IndexedSeqLike$Elements().init___sc_IndexedSeqLike__I__I(this, 0, this.size0$6)
});
$c_scm_ArrayBuffer.prototype.seq__scm_Seq = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.sizeHintBounded__I__sc_TraversableLike__V = (function(size, boundingColl) {
  $s_scm_Builder$class__sizeHintBounded__scm_Builder__I__sc_TraversableLike__V(this, size, boundingColl)
});
$c_scm_ArrayBuffer.prototype.init___I = (function(initialSize) {
  this.initialSize$6 = initialSize;
  $s_scm_ResizableArray$class__$$init$__scm_ResizableArray__V(this);
  return this
});
$c_scm_ArrayBuffer.prototype.length__I = (function() {
  return this.size0$6
});
$c_scm_ArrayBuffer.prototype.seq__sc_Seq = (function() {
  return this
});
$c_scm_ArrayBuffer.prototype.drop__I__O = (function(n) {
  var until = this.size0$6;
  return $s_sc_IndexedSeqOptimized$class__slice__sc_IndexedSeqOptimized__I__I__O(this, n, until)
});
$c_scm_ArrayBuffer.prototype.tail__O = (function() {
  return $s_sc_IndexedSeqOptimized$class__tail__sc_IndexedSeqOptimized__O(this)
});
$c_scm_ArrayBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuffer = (function(xs) {
  if ($is_sc_IndexedSeqLike(xs)) {
    var x2 = $as_sc_IndexedSeqLike(xs);
    var n = x2.length__I();
    var n$1 = ((this.size0$6 + n) | 0);
    $s_scm_ResizableArray$class__ensureSize__scm_ResizableArray__I__V(this, n$1);
    x2.copyToArray__O__I__I__V(this.array$6, this.size0$6, n);
    this.size0$6 = ((this.size0$6 + n) | 0);
    return this
  } else {
    return $as_scm_ArrayBuffer($s_scg_Growable$class__$$plus$plus$eq__scg_Growable__sc_TraversableOnce__scg_Growable(this, xs))
  }
});
$c_scm_ArrayBuffer.prototype.$$plus$eq__O__scm_Builder = (function(elem) {
  return this.$$plus$eq__O__scm_ArrayBuffer(elem)
});
$c_scm_ArrayBuffer.prototype.copyToArray__O__I__I__V = (function(xs, start, len) {
  $s_scm_ResizableArray$class__copyToArray__scm_ResizableArray__O__I__I__V(this, xs, start, len)
});
$c_scm_ArrayBuffer.prototype.sizeHint__I__V = (function(len) {
  if (((len > this.size0$6) && (len >= 1))) {
    var newarray = $newArrayObject($d_O.getArrayOf(), [len]);
    var src = this.array$6;
    var length = this.size0$6;
    $systemArraycopy(src, 0, newarray, 0, length);
    this.array$6 = newarray
  }
});
$c_scm_ArrayBuffer.prototype.hashCode__I = (function() {
  return $m_s_util_hashing_MurmurHash3$().seqHash__sc_Seq__I(this)
});
$c_scm_ArrayBuffer.prototype.$$plus$plus$eq__sc_TraversableOnce__scg_Growable = (function(xs) {
  return this.$$plus$plus$eq__sc_TraversableOnce__scm_ArrayBuffer(xs)
});
$c_scm_ArrayBuffer.prototype.stringPrefix__T = (function() {
  return "ArrayBuffer"
});
function $is_scm_ArrayBuffer(obj) {
  return (!(!((obj && obj.$classData) && obj.$classData.ancestors.scm_ArrayBuffer)))
}
function $as_scm_ArrayBuffer(obj) {
  return (($is_scm_ArrayBuffer(obj) || (obj === null)) ? obj : $throwClassCastException(obj, "scala.collection.mutable.ArrayBuffer"))
}
function $isArrayOf_scm_ArrayBuffer(obj, depth) {
  return (!(!(((obj && obj.$classData) && (obj.$classData.arrayDepth === depth)) && obj.$classData.arrayBase.ancestors.scm_ArrayBuffer)))
}
function $asArrayOf_scm_ArrayBuffer(obj, depth) {
  return (($isArrayOf_scm_ArrayBuffer(obj, depth) || (obj === null)) ? obj : $throwArrayCastException(obj, "Lscala.collection.mutable.ArrayBuffer;", depth))
}
var $d_scm_ArrayBuffer = new $TypeData().initClass({
  scm_ArrayBuffer: 0
}, false, "scala.collection.mutable.ArrayBuffer", {
  scm_ArrayBuffer: 1,
  scm_AbstractBuffer: 1,
  scm_AbstractSeq: 1,
  sc_AbstractSeq: 1,
  sc_AbstractIterable: 1,
  sc_AbstractTraversable: 1,
  O: 1,
  sc_Traversable: 1,
  sc_TraversableLike: 1,
  scg_HasNewBuilder: 1,
  scg_FilterMonadic: 1,
  sc_TraversableOnce: 1,
  sc_GenTraversableOnce: 1,
  sc_GenTraversableLike: 1,
  sc_Parallelizable: 1,
  sc_GenTraversable: 1,
  scg_GenericTraversableTemplate: 1,
  sc_Iterable: 1,
  sc_GenIterable: 1,
  sc_GenIterableLike: 1,
  sc_IterableLike: 1,
  s_Equals: 1,
  sc_Seq: 1,
  s_PartialFunction: 1,
  F1: 1,
  sc_GenSeq: 1,
  sc_GenSeqLike: 1,
  sc_SeqLike: 1,
  scm_Seq: 1,
  scm_Iterable: 1,
  scm_Traversable: 1,
  s_Mutable: 1,
  scm_SeqLike: 1,
  scm_Cloneable: 1,
  s_Cloneable: 1,
  jl_Cloneable: 1,
  scm_Buffer: 1,
  scm_BufferLike: 1,
  scg_Growable: 1,
  scg_Clearable: 1,
  scg_Shrinkable: 1,
  sc_script_Scriptable: 1,
  scg_Subtractable: 1,
  scm_IndexedSeqOptimized: 1,
  scm_IndexedSeqLike: 1,
  sc_IndexedSeqLike: 1,
  sc_IndexedSeqOptimized: 1,
  scm_Builder: 1,
  scm_ResizableArray: 1,
  scm_IndexedSeq: 1,
  sc_IndexedSeq: 1,
  sc_CustomParallelizable: 1,
  s_Serializable: 1,
  Ljava_io_Serializable: 1
});
$c_scm_ArrayBuffer.prototype.$classData = $d_scm_ArrayBuffer;
}).call(this);
//# sourceMappingURL=shmupwarz-fastopt.js.map
