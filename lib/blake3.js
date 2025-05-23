import { blake3 } from '@noble/hashes/blake3';
import { bytesToHex } from '@noble/hashes/utils';

export function hashBlake3(buffer) {
  return bytesToHex(blake3(buffer));
}