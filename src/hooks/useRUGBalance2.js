import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";
import { useMemo } from "react";


export const useRUGBalance2 = (addr, token_address) => {
    const { account } = useMoralisWeb3Api();
    const { chainId, walletAddress } = useMoralisDapp();
    const { resolveLink } = useIPFS();
    const getNFTsForContractOpts = {
        chain: chainId,
        address: walletAddress,
        token_address: "0xBe169ba8097583318A84014657eEcB5b32b283B8",
    };

    const {
        fetch: getNFTTokenIds,
        data,
        error,
        isLoading,
        isFetching,
    } = useMoralisWeb3ApiCall(
        account.getNFTsForContract,
        getNFTsForContractOpts,
        { autoFetch: !!account && addr !== "explore" },
    );

    const NFTTokenIds = useMemo(() => {
        console.log('fetching tokenIds data')
        if (!data?.result || !data?.result.length) {
            return data;
        }
        const formattedResult = data.result.map((nft) => {
            try {
                if (nft.metadata) {
                    const metadata = JSON.parse(nft.metadata);
                    const image = resolveLink(metadata?.image);
                    return { ...nft, image, metadata };
                }
            } catch (error) {
                return nft;
            }
            return nft;
        });

        return { ...data, result: formattedResult };
    }, [data]);

    return { getNFTTokenIds, data: NFTTokenIds, error, isLoading, isFetching };
};