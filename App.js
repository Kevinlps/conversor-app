import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "./src/components/Button";
import { Input } from "./src/components/Input";
import { styles } from "./App.styles";
import { KeyboardAvoidingView } from "react-native";
import { currencies } from "./src/constants/currencies";
import { ResultCard } from "./src/components/ResultCard";
import { exchangeRateApi } from "./src/services/api";
import { useState } from "react";
import { convertCurrency } from "./src/utils/convertCurrency";

export default function App() {
  const [ammount, setAmmount] = useState("0");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [exchangerate, setExchangerate] = useState(null);

  async function fatchExchangeRate() {
    try {    
    setLoading(true)
    if(!ammount) return

    const data = await exchangeRateApi(fromCurrency);
    const rate = data.rates[toCurrency];
    setExchangerate(rate)
    const convertedAmount = convertCurrency(ammount, rate);
    setResult(convertedAmount);
      
    } catch (err) {
      alert("Eroo, tente novamente!")
    }finally {
      setLoading(false)
    }
  }

  function swapCurrency(){
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult('')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.screllView}>
        <View style={styles.content}>
          <StatusBar style="ligth" />

          <View style={styles.header}>
            <Text style={styles.title}>Conversor de Moedas</Text>
            <Text style={styles.subTitle}>
              Converta valores entre diferentes moedas
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>De:</Text>
            <View style={styles.currencyGrid}>
              {currencies.map((currency) => (
                <Button
                  variant="primary"
                  key={currency.code}
                  currency={currency}
                  onPress={() => setFromCurrency(currency.code)}
                  isSelected={fromCurrency === currency.code}
                ></Button>
              ))}
            </View>

            <Input label="Valor: " value={ammount} onChangeText={setAmmount} />
            <TouchableOpacity style={styles.swapButton} onPress={swapCurrency}>
              <Text style={styles.swapButtonText}>⬆⬇</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Para:</Text>
            <View style={styles.currencyGrid}>
              {currencies.map((currency) => (
                <Button
                  variant="secundary"
                  key={currency.code}
                  currency={currency}
                  onPress={() => setToCurrency(currency.code)}
                  isSelected={toCurrency === currency.code}
                ></Button>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.convertButton, (!ammount || loading) && styles.convertButtonDisable]}
            onPress={fatchExchangeRate}
            disabled={!ammount || loading}
          >
            {loading ? (
              <ActivityIndicator color="white"/>
            ) : (<Text style={styles.swapButtonText}>Converter</Text>)}
            
          </TouchableOpacity>

          <ResultCard 
            exchangeRate={exchangerate}
            result={result}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            currencies={currencies}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
