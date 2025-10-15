export const BASE_HEALTH_CONTRACT = {
  address: "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8" as `0x${string}`, // Replace with your deployed contract address
  abi: [
    {
      inputs: [{ internalType: "string", name: "_hash", type: "string" }],
      name: "saveRecord",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_doctor", type: "address" }],
      name: "shareAccess",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_patient", type: "address" }],
      name: "getRecords",
      outputs: [
        {
          components: [
            { internalType: "string", name: "hash", type: "string" },
            { internalType: "uint256", name: "timestamp", type: "uint256" },
          ],
          internalType: "struct BaseHealth.Record[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      name: "records",
      outputs: [
        { internalType: "string", name: "hash", type: "string" },
        { internalType: "uint256", name: "timestamp", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
} as const
