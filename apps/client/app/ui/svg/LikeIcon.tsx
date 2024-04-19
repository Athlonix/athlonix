interface LikeIconProps {
  isClicked?: boolean;
}

const LikeIcon = (props: LikeIconProps) => {
  let path: JSX.Element;

  if (props.isClicked) {
    path = (
      <path
        fill="#4F46E5"
        stroke="#4F46E5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9.375 21.875V10.417H5.208L12.5 3.125l7.292 7.292h-4.167v11.458h-6.25Z"
      />
    );
  } else {
    path = (
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9.375 21.875V10.417H5.208L12.5 3.125l7.292 7.292h-4.167v11.458h-6.25Z"
      />
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} fill="none">
      <title>Like Icon</title>
      {path}
    </svg>
  );
};

export default LikeIcon;
