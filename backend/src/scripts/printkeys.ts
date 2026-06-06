import { Transaction } from "@solana/web3.js";





// Base64 serialized tx
const BASE64_TX =
  "AZqxQ3ppi9TJxVClB0jKWgVuyDHBGnjgTidgSH+e9c1ZoZdbynaVxgMryj8L4HCqI+n+eFYYmB0o1CFEqCr0rgcBAAUIJIDV/mHsUzwAIzlsy0rmU7TaTs8Fz9AqxUN2ybfFtaw8H5B4B3QTk0+b+0ouPyE5RJN6vT3huCyBF7UHE70NUfVKh8lFXgXiA5XFh8+XCMpS+WoZnGB/Km6mfPijpmGZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvOvU4W9fy3gHrVU9HDyKa+zeq+ekEDiVeug0Y41T9aPPjVr7LX3+Ji9qhH22zFxWfUQn3yoUryVHS5ZMURjJnCwb5KrliyarFpFRocEvK85VHyLx09IO36kedKZ8ZE6UG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqQaGhZ04yAqXIUgYQWkX4L+PyhV+Rk+YzP0P+p34RR6oAQYHAAUBAgQHAwj5rPVkIHVhnA==";





// Deserialize transaction
const tx = Transaction.from(
  Buffer.from(BASE64_TX, "base64")
);


console.log("=== Transaction Keys ===\n");

tx.instructions.forEach((ix, ixIndex) => {

  console.log(`\nInstruction ${ixIndex}`);
  console.log(
    "Program ID:",
    ix.programId.toBase58()
  );

  ix.keys.forEach((key, keyIndex) => {

    console.log(
      `\n  Key ${keyIndex}`
    );

    console.log(
      "    Pubkey:",
      key.pubkey.toBase58()
    );

    console.log(
      "    Signer:",
      key.isSigner
    );

    console.log(
      "    Writable:",
      key.isWritable
    );
  });

});


console.log("\n=== All Unique Account Keys ===\n");

const uniqueKeys = new Map<string, {
  signer: boolean;
  writable: boolean;
}>();


tx.instructions.forEach(ix => {

  ix.keys.forEach(key => {

    const address = key.pubkey.toBase58();

    if (!uniqueKeys.has(address)) {
      uniqueKeys.set(address, {
        signer: key.isSigner,
        writable: key.isWritable
      });
    } else {
      const old = uniqueKeys.get(address)!;

      old.signer ||= key.isSigner;
      old.writable ||= key.isWritable;
    }

  });

});


let i = 0;

for (const [pubkey, flags] of uniqueKeys) {

  console.log(`${i++}. ${pubkey}`);
  console.log(
    "   signer:",
    flags.signer,
    " writable:",
    flags.writable
  );

}