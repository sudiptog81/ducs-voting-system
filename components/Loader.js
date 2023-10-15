import { Dna } from "react-loader-spinner";

export default function SpinnerLoading() {
  return (
    <Dna
      visible={true}
      height="80"
      width="80"
      ariaLabel="dna-loading"
      wrapperStyle={{}}
      wrapperClass="dna-wrapper text-center"
    />
  );
}
