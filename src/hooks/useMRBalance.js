import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useMRBalance = () => {
  const { account } = useMoralisWeb3Api();
  const { chainId, walletAddress } = useMoralisDapp();
  const { resolveLink } = useIPFS();
  const [MRBalance, setMRBalance] = useState([]);
  const {
    fetch: getMRBalance,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(account.getNFTsForContract, { chain: chainId, address: walletAddress, token_address: "0xdA2fFAE045D03cC9aDf4d860773B61263dbA4EE3" });
  

  useEffect(() => {
    if (data?.result) {
      const NFTs = data.result;
      for (let NFT of NFTs) {
        if (NFT?.metadata) {
          NFT.metadata = JSON.parse(NFT.metadata);
          // metadata is a string type
          NFT.image = resolveLink(NFT.metadata?.image);
        }
      }
      setMRBalance(NFTs);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { getMRBalance, MRBalance, error, isLoading };
};
