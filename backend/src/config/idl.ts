export const idl = {
  "address": "k3ep1PK9dkQyzHm5STsP7dg3wK2Y73qxuJB5nStGvyS",
  "metadata": {
    "name": "horizon_contract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "create_admin",
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
          "name": "admin_pda",
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
          "name": "system_program",
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
          "name": "platform_fee_bps",
          "type": "u64"
        },
        {
          "name": "escrow_flag",
          "type": "bool"
        },
        {
          "name": "admin_fee_vault",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "create_merchant",
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
          "name": "merchant_pda",
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
          "name": "merchant_vault",
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
                "path": "merchant_pda"
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
          "name": "token_program"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "disable_transfer",
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
          "name": "merchant_pda",
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
                "account": "MerchantPda"
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
      "name": "enable_transfer",
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
          "name": "merchant_pda",
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
                "account": "MerchantPda"
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
      "name": "freeze_vault",
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
          "name": "merchant_pda",
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
                "account": "MerchantPda"
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
          "name": "duration_seconds",
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
          "name": "user_ata",
          "writable": true
        },
        {
          "name": "merchant_pda",
          "writable": true
        },
        {
          "name": "admin_pda",
          "writable": true
        },
        {
          "name": "merchant_vault",
          "writable": true
        },
        {
          "name": "admin_fee_vault",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "payment_intent",
          "type": "string"
        }
      ]
    },
    {
      "name": "unfreeze_vault",
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
          "name": "merchant_pda",
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
                "account": "MerchantPda"
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
          "name": "merchant_signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "merchant_pda",
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
                "path": "merchant_signer"
              },
              {
                "kind": "account",
                "path": "merchant_pda.admin_pda",
                "account": "MerchantPda"
              }
            ]
          }
        },
        {
          "name": "merchant_vault",
          "writable": true
        },
        {
          "name": "merchant_ata",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "token_program"
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
      "name": "AdminPda",
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
      "name": "MerchantPda",
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
      "name": "EscrowAdvanced",
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
      "name": "FundsReleased",
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
      "name": "MerchantOnboarded",
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
      "name": "PaymentReceived",
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
      "name": "RecurringPulled",
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
      "name": "RecurringSetup",
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
      "name": "RecurringStopped",
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
      "name": "VaultFrozen",
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
      "name": "VaultUnfrozen",
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
      "name": "WithdrawExecuted",
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
      "name": "Unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6001,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6002,
      "name": "InvalidReleaseAmount",
      "msg": "Invalid release amount"
    },
    {
      "code": 6003,
      "name": "VaultFrozen",
      "msg": "Merchant Account is frozen"
    },
    {
      "code": 6004,
      "name": "TransferDisabled",
      "msg": "Transfers are disabled"
    },
    {
      "code": 6005,
      "name": "FreezeDurationTooLong",
      "msg": "Freeze duration exceeds maximum allowed"
    },
    {
      "code": 6006,
      "name": "RecurringInactive",
      "msg": "Recurring payment is inactive"
    },
    {
      "code": 6007,
      "name": "TooEarly",
      "msg": "Recurring payment is not due yet"
    },
    {
      "code": 6008,
      "name": "InsufficientWithdrawableBalance",
      "msg": "Insufficient withdrawable balance"
    },
    {
      "code": 6009,
      "name": "MathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6010,
      "name": "MerchantAlreadyExists",
      "msg": "Merchant already exists"
    },
    {
      "code": 6011,
      "name": "AdminAlreadyInitialized",
      "msg": "Admin already initialized"
    },
    {
      "code": 6012,
      "name": "OperatorAlreadyExists",
      "msg": "Operator already exists"
    },
    {
      "code": 6013,
      "name": "OperatorNotFound",
      "msg": "Operator not found"
    },
    {
      "code": 6014,
      "name": "SuperadminAlreadyExists",
      "msg": "Superadmin already exists"
    },
    {
      "code": 6015,
      "name": "SuperadminNotFound",
      "msg": "Superadmin not found"
    },
    {
      "code": 6016,
      "name": "LastSuperadminRemoval",
      "msg": "At least one superadmin must remain"
    },
    {
      "code": 6017,
      "name": "MaxOperatorsReached",
      "msg": "Maximum operators limit reached"
    },
    {
      "code": 6018,
      "name": "MaxSuperadminsReached",
      "msg": "Maximum superadmins limit reached"
    },
    {
      "code": 6019,
      "name": "InvalidFeeConfig",
      "msg": "Invalid fee configuration"
    },
    {
      "code": 6020,
      "name": "InvariantViolation",
      "msg": "Account invariant violated"
    },
    {
      "code": 6021,
      "name": "InvalidMerchantVault",
      "msg": "Invalid merchant vault"
    },
    {
      "code": 6022,
      "name": "MinimumSuperadminsRequired",
      "msg": "At least 2 superadmins are required"
    },
    {
      "code": 6023,
      "name": "TooManySuperadmins",
      "msg": "Too many superadmins"
    },
    {
      "code": 6024,
      "name": "TooManyOperators",
      "msg": "Too many operators"
    },
    {
      "code": 6025,
      "name": "AlreadyUpdatedToday",
      "msg": "already updated pda today"
    }
  ],
  "types": [
    {
      "name": "AdminPda",
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
            "name": "platform_fee_bps",
            "type": "u64"
          },
          {
            "name": "escrow_flag",
            "type": "bool"
          },
          {
            "name": "admin_fee_vault",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "EscrowAdvanced",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "slots_advanced",
            "type": "u8"
          },
          {
            "name": "amount_released",
            "type": "u64"
          },
          {
            "name": "new_withdrawable",
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
      "name": "FundsReleased",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "release_amount",
            "type": "u64"
          },
          {
            "name": "new_withdrawable",
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
      "name": "MerchantOnboarded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchantpda",
            "type": "pubkey"
          },
          {
            "name": "merchant_vault",
            "type": "pubkey"
          },
          {
            "name": "merchantwalletpubkey",
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
      "name": "MerchantPda",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin_pda",
            "type": "pubkey"
          },
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "transfer_flag",
            "type": "bool"
          },
          {
            "name": "freeze_flag",
            "type": "bool"
          },
          {
            "name": "freeze_expires_at",
            "type": "i64"
          },
          {
            "name": "vault_count",
            "type": "u64"
          },
          {
            "name": "total_amount",
            "type": "u64"
          },
          {
            "name": "withdrawable_amount",
            "type": "u64"
          },
          {
            "name": "withheld_amount",
            "type": "u64"
          },
          {
            "name": "withheld_buckets",
            "type": {
              "array": [
                "u64",
                7
              ]
            }
          },
          {
            "name": "current_index",
            "type": "u8"
          },
          {
            "name": "current_date",
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
      "name": "PaymentReceived",
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
            "name": "payment_intent",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "RecurringPulled",
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
            "name": "next_payment_at",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "RecurringSetup",
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
            "name": "next_payment_at",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "RecurringStopped",
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
            "name": "stopped_at",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "VaultFrozen",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "frozen_by",
            "type": "pubkey"
          },
          {
            "name": "expires_at",
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
      "name": "VaultUnfrozen",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "unfrozen_by",
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
      "name": "WithdrawExecuted",
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
}