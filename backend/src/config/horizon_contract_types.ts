/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/horizon_contract.json`.
 */
export type HorizonContract = {
  "address": "k3ep1PK9dkQyzHm5STsP7dg3wK2Y73qxuJB5nStGvyS",
  "metadata": {
    "name": "horizonContract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createAdmin",
      "discriminator": [
        235,
        218,
        207,
        161,
        38,
        135,
        223,
        48
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "adminPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "superadmins",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "operators",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "platformFeeBps",
          "type": "u64"
        },
        {
          "name": "escrowFlag",
          "type": "bool"
        },
        {
          "name": "adminFeeVault",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "createMerchant",
      "discriminator": [
        249,
        172,
        245,
        100,
        32,
        117,
        97,
        156
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin"
        },
        {
          "name": "merchantPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "merchantVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchantPda"
              },
              {
                "kind": "const",
                "value": [
                  1,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "disableTransfer",
      "discriminator": [
        102,
        76,
        151,
        44,
        92,
        0,
        2,
        90
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin"
        },
        {
          "name": "merchantPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchant_pda.merchant",
                "account": "merchantPda"
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "enableTransfer",
      "discriminator": [
        47,
        9,
        49,
        230,
        50,
        16,
        61,
        254
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin"
        },
        {
          "name": "merchantPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchant_pda.merchant",
                "account": "merchantPda"
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "freezeVault",
      "discriminator": [
        144,
        211,
        63,
        236,
        97,
        31,
        170,
        175
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin"
        },
        {
          "name": "merchantPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchant_pda.merchant",
                "account": "merchantPda"
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "durationSeconds",
          "type": "i64"
        }
      ]
    },
    {
      "name": "pay",
      "discriminator": [
        119,
        18,
        216,
        65,
        192,
        117,
        122,
        220
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAta",
          "writable": true
        },
        {
          "name": "merchantPda",
          "writable": true
        },
        {
          "name": "adminPda",
          "writable": true
        },
        {
          "name": "merchantVault",
          "writable": true
        },
        {
          "name": "adminFeeVault",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "unfreezeVault",
      "discriminator": [
        145,
        244,
        206,
        234,
        251,
        250,
        116,
        183
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin"
        },
        {
          "name": "merchantPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchant_pda.merchant",
                "account": "merchantPda"
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "withdraw",
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "merchantSigner",
          "writable": true,
          "signer": true
        },
        {
          "name": "merchantPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchant_pda.merchant",
                "account": "merchantPda"
              }
            ]
          }
        },
        {
          "name": "merchantVault",
          "writable": true
        },
        {
          "name": "merchantAta",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "adminPda",
      "discriminator": [
        172,
        90,
        45,
        66,
        128,
        59,
        220,
        22
      ]
    },
    {
      "name": "merchantPda",
      "discriminator": [
        233,
        116,
        23,
        182,
        239,
        228,
        57,
        36
      ]
    }
  ],
  "events": [
    {
      "name": "escrowAdvanced",
      "discriminator": [
        26,
        226,
        83,
        52,
        126,
        149,
        78,
        31
      ]
    },
    {
      "name": "fundsReleased",
      "discriminator": [
        178,
        119,
        252,
        230,
        131,
        104,
        210,
        210
      ]
    },
    {
      "name": "merchantOnboarded",
      "discriminator": [
        216,
        97,
        54,
        161,
        73,
        101,
        167,
        45
      ]
    },
    {
      "name": "paymentReceived",
      "discriminator": [
        238,
        145,
        50,
        71,
        36,
        83,
        130,
        215
      ]
    },
    {
      "name": "recurringPulled",
      "discriminator": [
        175,
        143,
        93,
        172,
        220,
        127,
        21,
        194
      ]
    },
    {
      "name": "recurringSetup",
      "discriminator": [
        109,
        244,
        255,
        97,
        101,
        204,
        69,
        250
      ]
    },
    {
      "name": "recurringStopped",
      "discriminator": [
        233,
        123,
        49,
        117,
        39,
        240,
        27,
        91
      ]
    },
    {
      "name": "vaultFrozen",
      "discriminator": [
        13,
        199,
        172,
        111,
        88,
        10,
        151,
        247
      ]
    },
    {
      "name": "vaultUnfrozen",
      "discriminator": [
        128,
        194,
        79,
        155,
        85,
        31,
        226,
        170
      ]
    },
    {
      "name": "withdrawExecuted",
      "discriminator": [
        132,
        197,
        103,
        54,
        18,
        141,
        117,
        0
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6001,
      "name": "invalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6002,
      "name": "invalidReleaseAmount",
      "msg": "Invalid release amount"
    },
    {
      "code": 6003,
      "name": "vaultFrozen",
      "msg": "Merchant Account is frozen"
    },
    {
      "code": 6004,
      "name": "transferDisabled",
      "msg": "Transfers are disabled"
    },
    {
      "code": 6005,
      "name": "freezeDurationTooLong",
      "msg": "Freeze duration exceeds maximum allowed"
    },
    {
      "code": 6006,
      "name": "recurringInactive",
      "msg": "Recurring payment is inactive"
    },
    {
      "code": 6007,
      "name": "tooEarly",
      "msg": "Recurring payment is not due yet"
    },
    {
      "code": 6008,
      "name": "insufficientWithdrawableBalance",
      "msg": "Insufficient withdrawable balance"
    },
    {
      "code": 6009,
      "name": "mathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6010,
      "name": "merchantAlreadyExists",
      "msg": "Merchant already exists"
    },
    {
      "code": 6011,
      "name": "adminAlreadyInitialized",
      "msg": "Admin already initialized"
    },
    {
      "code": 6012,
      "name": "operatorAlreadyExists",
      "msg": "Operator already exists"
    },
    {
      "code": 6013,
      "name": "operatorNotFound",
      "msg": "Operator not found"
    },
    {
      "code": 6014,
      "name": "superadminAlreadyExists",
      "msg": "Superadmin already exists"
    },
    {
      "code": 6015,
      "name": "superadminNotFound",
      "msg": "Superadmin not found"
    },
    {
      "code": 6016,
      "name": "lastSuperadminRemoval",
      "msg": "At least one superadmin must remain"
    },
    {
      "code": 6017,
      "name": "maxOperatorsReached",
      "msg": "Maximum operators limit reached"
    },
    {
      "code": 6018,
      "name": "maxSuperadminsReached",
      "msg": "Maximum superadmins limit reached"
    },
    {
      "code": 6019,
      "name": "invalidFeeConfig",
      "msg": "Invalid fee configuration"
    },
    {
      "code": 6020,
      "name": "invariantViolation",
      "msg": "Account invariant violated"
    },
    {
      "code": 6021,
      "name": "invalidMerchantVault",
      "msg": "Invalid merchant vault"
    },
    {
      "code": 6022,
      "name": "minimumSuperadminsRequired",
      "msg": "At least 2 superadmins are required"
    },
    {
      "code": 6023,
      "name": "tooManySuperadmins",
      "msg": "Too many superadmins"
    },
    {
      "code": 6024,
      "name": "tooManyOperators",
      "msg": "Too many operators"
    },
    {
      "code": 6025,
      "name": "alreadyUpdatedToday",
      "msg": "already updated pda today"
    }
  ],
  "types": [
    {
      "name": "adminPda",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "superadmins",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "operators",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "platformFeeBps",
            "type": "u64"
          },
          {
            "name": "escrowFlag",
            "type": "bool"
          },
          {
            "name": "adminFeeVault",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "escrowAdvanced",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "slotsAdvanced",
            "type": "u8"
          },
          {
            "name": "amountReleased",
            "type": "u64"
          },
          {
            "name": "newWithdrawable",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "fundsReleased",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "releaseAmount",
            "type": "u64"
          },
          {
            "name": "newWithdrawable",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "merchantOnboarded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "merchantPda",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adminPda",
            "type": "pubkey"
          },
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "transferFlag",
            "type": "bool"
          },
          {
            "name": "freezeFlag",
            "type": "bool"
          },
          {
            "name": "freezeExpiresAt",
            "type": "i64"
          },
          {
            "name": "vaultCount",
            "type": "u64"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "withdrawableAmount",
            "type": "u64"
          },
          {
            "name": "withheldAmount",
            "type": "u64"
          },
          {
            "name": "withheldBuckets",
            "type": {
              "array": [
                "u64",
                7
              ]
            }
          },
          {
            "name": "currentIndex",
            "type": "u8"
          },
          {
            "name": "currentDate",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "paymentReceived",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "recurringPulled",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "nextPaymentAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "recurringSetup",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "nextPaymentAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "recurringStopped",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "stoppedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "vaultFrozen",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "frozenBy",
            "type": "pubkey"
          },
          {
            "name": "expiresAt",
            "type": "i64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "vaultUnfrozen",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "unfrozenBy",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "withdrawExecuted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
