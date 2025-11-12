import "../styles.css";
import { environment } from "../system/environment/environment";
import { DefaultProps } from "../system/utils/Tools";
import { Quality } from "./ImageApi";

export interface ShowImageProps extends DefaultProps {
  imageId?: string;
  quality?: Quality;
}

export default function ShowImage(props: ShowImageProps) {
  const getImageUrl = () => {
    if (props.imageId === undefined) {
      return "/assets/profile.png";
    }

    let result =
      environment.imageServerUrl + "images/" + props.imageId + "/jpeg";
    if (props.quality != null) {
      result += "?Size=" + props.quality;
    }
    return result;
  };

  if (!props.imageId) {
    return null;
  }
  return (
    <div>
      <img alt="" src={getImageUrl()} />
      <div className="text-block">
        <strong>{props.quality ? props.quality : "Original"}</strong>
      </div>
      <br />
    </div>
  );
}
