import { useEffect } from "react";
import { Image } from "react-native";
import { useImageManipulator, SaveFormat } from "expo-image-manipulator";

type Props = {
  uri: string;
  onProcessed: (uri: string) => void;
};

const ImageProcessor = ({ uri, onProcessed }: Props) => {
  const context = useImageManipulator(uri);

  useEffect(() => {
    const process = async () => {
      const initial = await context.renderAsync();
      const { width: imgWidth, height: imgHeight } = initial;

      const cropWidth = imgWidth * 0.52;
      const cropHeight = cropWidth;
      const originX = (imgWidth - cropWidth) / 2;
      const originY = (imgHeight - cropHeight) / 2;

      context.crop({
        originX,
        originY,
        width: cropWidth,
        height: cropHeight,
      });
      context.resize({ width: 500 });

      const processed = await context.renderAsync();
      const result = await processed.saveAsync({
        compress: 0.8,
        format: SaveFormat.PNG,
      });

      onProcessed(result.uri);
    };

    process();
  }, [uri]);

  return null;
};

export default ImageProcessor;
