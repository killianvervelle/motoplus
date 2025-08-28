"use client";
import { useEffect } from "react";

const Youtube = ({
  id,
  title,
  ...rest
}: {
  id: string;
  title: string;
  [key: string]: any;
}) => {
  useEffect(() => {
    import("@justinribeiro/lite-youtube");
  }, []);

  // @ts-expect-error frontmatter[name] type not defined in Post
  return <lite-youtube videoid={id} videotitle={title} {...rest} />;
};

export default Youtube;
