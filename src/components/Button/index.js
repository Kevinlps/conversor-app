import { TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { Text } from "react-native";

export default function Button({ variant = "primary", onPress, currency, isSelected}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isSelected && (variant === "primary" ? styles.buttonPrimary : styles.buttonSecundary)
      ]}
    >
      <Text style={styles.buttonText}>{currency.code}</Text>
    </TouchableOpacity>
  );
}
