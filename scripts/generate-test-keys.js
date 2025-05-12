import sodium from 'libsodium-wrappers';

async function generateTestKeys() {
  await sodium.ready;
  
  // Generate key pair
  const keypair = sodium.crypto_sign_keypair();
  
  // Convert to base64
  const publicKey = sodium.to_base64(keypair.publicKey);
  const privateKey = sodium.to_base64(keypair.privateKey);

  // Create a test hash
  const testHash = 'de7a6140da6f782498d7e138e8dd22a7c00448e227841a9a418b1547493df0e8';
  const message = Buffer.from(testHash, 'hex');

  // Sign the hash
  const signature = sodium.crypto_sign_detached(message, keypair.privateKey);
  const signatureBase64 = sodium.to_base64(signature);

  // Debug information
  console.log('Key lengths:', {
    publicKeyBase64: publicKey.length,
    publicKeyDecoded: keypair.publicKey.length,
    privateKeyBase64: privateKey.length,
    privateKeyDecoded: keypair.privateKey.length,
    signatureBase64: signatureBase64.length,
    signatureDecoded: signature.length
  });

  console.log('\nAdd these to your .env.local:');
  console.log('ED25519_PUBLIC_KEY=' + publicKey);
  console.log('ED25519_PRIVATE_KEY=' + privateKey);
  console.log('\nTest values:');
  console.log('hash:', testHash);
  console.log('signature:', signatureBase64);
}

generateTestKeys().catch(console.error); 