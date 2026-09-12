// Polyfills para runtime Node.js / Vercel Serverless onde @napi-rs/canvas não está disponível
class MockDOMMatrix {
  a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
  m11 = 1; m12 = 0; m13 = 0; m14 = 0;
  m21 = 0; m22 = 1; m23 = 0; m24 = 0;
  m31 = 0; m32 = 0; m33 = 1; m34 = 0;
  m41 = 0; m42 = 0; m43 = 0; m44 = 1;
  is2D = true;
  isIdentity = true;

  constructor(init?: any) {
    if (Array.isArray(init) && init.length === 6) {
      this.a = this.m11 = init[0];
      this.b = this.m12 = init[1];
      this.c = this.m21 = init[2];
      this.d = this.m22 = init[3];
      this.e = this.m41 = init[4];
      this.f = this.m42 = init[5];
    } else if (Array.isArray(init) && init.length === 16) {
      this.m11 = this.a = init[0];
      this.m12 = this.b = init[1];
      this.m13 = init[2];
      this.m14 = init[3];
      this.m21 = this.c = init[4];
      this.m22 = this.d = init[5];
      this.m23 = init[6];
      this.m24 = init[7];
      this.m31 = init[8];
      this.m32 = init[9];
      this.m33 = init[10];
      this.m34 = init[11];
      this.m41 = this.e = init[12];
      this.m42 = this.f = init[13];
      this.m43 = init[14];
      this.m44 = init[15];
      this.is2D = false;
    }
  }

  multiply() { return this; }
  preMultiplySelf() { return this; }
  multiplySelf() { return this; }
  invertSelf() { return this; }
  translate() { return this; }
  scale() { return this; }
  transformPoint(p: any) { return p; }
}

if (typeof globalThis.DOMMatrix === 'undefined') {
  (globalThis as any).DOMMatrix = MockDOMMatrix;
}

if (typeof globalThis.ImageData === 'undefined') {
  (globalThis as any).ImageData = class MockImageData {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    constructor(w = 0, h = 0) {
      this.width = w;
      this.height = h;
      this.data = new Uint8ClampedArray(w * h * 4);
    }
  };
}

if (typeof globalThis.Path2D === 'undefined') {
  (globalThis as any).Path2D = class MockPath2D {
    addPath() {}
  };
}

export {};
