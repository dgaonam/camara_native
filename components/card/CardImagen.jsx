import { Image } from "react-native";

const CardImagen=({url,diseño,imagen})=>{
  const imagenSelected=imagen!==null ? imagen:url;
  
  console.log("Ruta: ", url);
  console.log("Imagen Selected: ", imagenSelected);
    return(
        <Image
          source={{uri: imagenSelected}}
          style={diseño.image}
        />
    );
};

export default CardImagen;