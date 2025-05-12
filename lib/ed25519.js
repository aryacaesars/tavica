import sodium from 'libsodium-wrappers';

export async function sign(message, base64PrivateKey) {
  await sodium.ready;
  const privateKey = sodium.from_base64(base64PrivateKey);
  const signature = sodium.crypto_sign_detached(message, privateKey);
  return sodium.to_base64(signature);
}

export async function verify(message, base64Signature, base64PublicKey) {
  try {
    await sodium.ready;
    
    // Validate inputs
    if (!message || !base64Signature || !base64PublicKey) {
      throw new Error('Missing required parameters');
    }

    // Convert from base64
    const signature = sodium.from_base64(base64Signature);
    
    // For Ed25519, we need to use the public key directly from base64
    // The key should be 32 bytes when decoded
    const publicKey = sodium.from_base64(base64PublicKey);
    
    // Debug information
    console.log('Key lengths:', {
      publicKeyBase64: base64PublicKey.length,
      publicKeyDecoded: publicKey.length,
      signatureBase64: base64Signature.length,
      signatureDecoded: signature.length,
      messageLength: message.length
    });

    // Validate lengths
    if (publicKey.length !== 32) {
      throw new Error(`Invalid public key length: ${publicKey.length} bytes (expected 32 bytes)`);
    }
    if (signature.length !== 64) {
      throw new Error(`Invalid signature length: ${signature.length} bytes (expected 64 bytes)`);
    }

    return sodium.crypto_sign_verify_detached(signature, message, publicKey);
  } catch (error) {
    console.error('Verification error:', {
      messageLength: message?.length,
      signatureLength: base64Signature?.length,
      publicKeyLength: base64PublicKey?.length,
      error: error.message
    });
    throw error;
  }
} 