async function webgpuAvailable() {
  if (!navigator.gpu) {
    return false;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    return false;
  }

  const device = await adapter.requestDevice();
  if (!device) {
    return false;
  }
  return true;
}
