#include <OneWire.h>
#include <DallasTemperature.h>
#include <LCDI2C_Latin_Symbols.h>
#include <WiFi.h>
#include <HTTPClient.h>

// **************** WIFI ******************* //

const char* ssid = "";
const char* password = "";
const char* serverName = "http://172.20.10.4:3000/gravarDados";

void conectarWiFi(const char* ssid, const char* password)
{
  Serial.print("Conectando a rede ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println(" ");
  Serial.println("WiFi Conectado");
  Serial.println(WiFi.localIP());
}

// ******************* FIM WIFI ********************* //




// ****************** Sensor de Temperatura **************** //

const int ONE_WIRE_BUS = 13; // Define o pino ao qual o sensor está conectado (Temperatura)
OneWire oneWire(ONE_WIRE_BUS); // Inicializa o barramento 1-Wire
DallasTemperature sensors(&oneWire); // Passa o objeto oneWire para a biblioteca DallasTemperature

// ***************** FIM Sensor de Temperatura ************************** //




// *************************** Sensor de PH ************************************** //

float valor_calibracao = 21.24; // Fator de calibração
int contagem = 0;               // Variável de contagem
float soma_tensao = 0;          // Variável para soma de tensão
float media = 0;                // Variável que calcula a media
float entrada;                  // Variável de leitura do pino A0
float tensao;                   // Variável para conversão em tensão
unsigned long tempo;            // Float tempo

// **************************** FIM Sensor de PH *************************** //




// *************************** Sensor Nível de Água ********************* //

const int sensorPin = 12; // Pino de entrada digital conectado ao sensor de nível de água

// *************************** FIM Sensor Nível de Água ********************* //




// ************************** Display ************************ //

#define LCD_ADDRESS 0x27 // Endereço do display LCD 16x2 I2C
#define LCD_COLUMNS 16   // Número de colunas e linhas do display LCD
#define LCD_ROWS 2
LCDI2C_Latin_Symbols lcd(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS); // Inicializa o objeto do display LCD

// ************************ FIM Display ********************** //




// ****************** Controle do Buzzer, LEDs e Botão **************** //

#define buzzer_pin 17   // Pino do buzzer
#define button_pin 25   // Pino do botão
#define led_vermelho1 14
#define led_verde1 27
#define led_azul1 16
#define led_vermelho2 18
#define led_verde2 19
#define led_azul2 23

bool temp_alarme = false;
bool ph_alarme = false;
bool nivel_alarme = false;
bool buzzer_ativo = false; // Variável para rastrear o estado do buzzer
int tempob;

void tocarbuzzer() // Função para acionar o buzzer
{
  for(tempob=0; tempob<2000000; tempob++)
  {
    digitalWrite(buzzer_pin, HIGH);
    tempob++;
  }

  for(tempob=0;tempob<6000000; tempob++)
  {
    digitalWrite(buzzer_pin, LOW);
    tempob++;
  }
}

// ****************** FIM Controle do Buzzer, LED e Botão **************** //




// ****************** Envio de Dados para o Firebase ******************* //

void enviarDados(float temperatura, float valor_pH, int waterLevel) 
{
  if (WiFi.status() == WL_CONNECTED) 
  {
    HTTPClient http;
    const char* serverName = "http://172.20.10.4:3000/gravarDados"; // URL do servidor
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    String completo = (waterLevel == LOW) ? "true" : "false"; // Define o valor de "completo" com base no nível de água
    String jsonData = "{\"nome\":\"Tanque15\",\"completo\":" + completo + ",\"funcionando\":true,\"temperatura\":" + String(temperatura) + 
      ",\"ph\":" + String(valor_pH) + ",\"nivelAgua\":" + String(waterLevel == LOW ? 100 : 0) + "}"; // Convertendo os dados para JSON

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) 
    {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } 
    else 
    {
      Serial.print("Erro ao enviar POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } 
  else 
  {
    Serial.println("Erro na conexão WiFi");
  }
}

// ****************** Fim do Envio de Dados para o Firebase ******************* //




unsigned long previousMillis = 0; // Variável para armazenar o último tempo de envio
const long interval = 10000; // Intervalo de tempo em milissegundos (1 minuto = 60000 ms)

void setup()
{
  Serial.begin(9600); // Inicializa a comunicação serial
  conectarWiFi(ssid, password); // Chama a função para se conectar ao WiFi
  sensors.begin(); // Inicializa o sensor DS18B20

  lcd.init();        // Inicializa o display LCD
  lcd.backlight();   // Liga a luz de fundo do display
  lcd.clear();       // Limpa o display

  pinMode(sensorPin, INPUT_PULLUP); // Configura o pino como entrada com pull-up interno ativado
  pinMode(led_vermelho1, OUTPUT);   // LED vermelho1
  pinMode(led_verde1, OUTPUT);      // LED verde1
  pinMode(led_azul1, OUTPUT);       // LED azul1
  pinMode(led_vermelho2, OUTPUT);   // LED vermelho2
  pinMode(led_verde2, OUTPUT);      // LED verde2
  pinMode(led_azul2, OUTPUT);       // LED azul2
  pinMode(buzzer_pin, OUTPUT);      // Buzzer
  pinMode(button_pin, INPUT_PULLUP); // Botão com pull-up interno ativado
}

void loop()
{
  unsigned long currentMillis = millis(); // Obtém o tempo atual
  bool estadoBotao = digitalRead(button_pin); // Leitura do estado do botão

  if (estadoBotao == HIGH) // Se o botão estiver pressionado, desativa o alarme
  {
    temp_alarme = false;
    ph_alarme = false;
    nivel_alarme = false;
    buzzer_ativo = false; // Atualiza o estado do buzzer
    digitalWrite(buzzer_pin, LOW); // Garante que o buzzer está desligado
    Serial.println("Alarme desativado");
  }

  // *************************** Sensor de Temperatura ************************** //
  
  sensors.requestTemperatures(); // Atualiza as leituras do sensor
  float temperaturaC = sensors.getTempCByIndex(0); // Lê a temperatura em graus Celsius

  if (temperaturaC != DEVICE_DISCONNECTED_C) // Verifica se a leitura é válida
  {
    Serial.print("Temperatura: ");// Exibe a temperatura no Serial Monitor
    Serial.print(temperaturaC);
    Serial.println("°C");

    lcd.setCursor(0, 0);
    lcd.print("Temp: "); // Escreve uma mensagem no display
    lcd.print(temperaturaC);
    lcd.print("°C");
  }

  if (temperaturaC > 24 && temperaturaC < 28) 
  {
    digitalWrite(led_vermelho1, HIGH); 
    digitalWrite(led_verde1, LOW); 
    digitalWrite(led_azul1, HIGH);

    if (temp_alarme == true && ph_alarme == false && nivel_alarme == false)
    {
      digitalWrite(buzzer_pin, LOW); // Desativa o buzzer
      temp_alarme = false;
      buzzer_ativo = false; // Atualiza o estado do buzzer
    }
  } 
   
  if (temperaturaC >= 28) // Liga o LED vermelho se a temperatura for maior que 28°C
  {
    digitalWrite(led_vermelho1, LOW); 
    digitalWrite(led_verde1, HIGH);  
    digitalWrite(led_azul1, HIGH);

    if (temp_alarme == false && estadoBotao == LOW && buzzer_ativo == false) 
    {
      temp_alarme = true;
      buzzer_ativo = true; // Atualiza o estado do buzzer
    }

    if (temp_alarme == true)
    {
      tocarbuzzer();
    }
  }

  if (temperaturaC <=24) //  Liga o LED azul se a temperatura for menor que 24°C
  {
    digitalWrite(led_vermelho1, HIGH); 
    digitalWrite(led_verde1, HIGH);  
    digitalWrite(led_azul1, LOW);

    if (temp_alarme == false && estadoBotao == LOW && buzzer_ativo == false) 
    {
      temp_alarme = true;
      buzzer_ativo = true; // Atualiza o estado do buzzer
    }

    if (temp_alarme == true)
    {
      tocarbuzzer();
    }
  } 

// **************** FIM Sensor de Temperatura ******************** //




  // ******************** Sensor de PH ******************************** //

  soma_tensao = 0; // Inicia soma_tensão em 0
  contagem = 0;    // Inicia a contagem em 0

  while (contagem < 10) // Executa enquanto contagem menor que 10
  {
    tempo = millis();        // Define o tempo em microssegundos
    entrada = analogRead(34); // Lê a entrada analógica
    tensao = (entrada * 3.29) / 4096;
    tensao = tensao * 1.063829787234043; // Converte em tensão, o valor lido
    soma_tensao = (soma_tensao + tensao); // Soma a tensão anterior com a atual
    contagem++; // Soma 1 à variável de contagem
    delay(100); // Aguarda para próxima leitura
  }

  media = soma_tensao / 10; // Calcula a média das leituras
  float valor_pH = -5.70 * media + valor_calibracao; // Calcula valor de pH
  lcd.setCursor(0, 1);
  lcd.print("Valor do PH: "); // Escreve outra mensagem no display
  lcd.print(valor_pH);        // Escreve outra mensagem no display
  Serial.print("Valor do PH: ");
  Serial.println(valor_pH);

  if (8 <= valor_pH && valor_pH < 11) // Liga o LED verde e azul (ciano) se o PH estiver entre 8 e 11
  {
    digitalWrite(led_vermelho2, HIGH);
    digitalWrite(led_verde2, LOW);
    digitalWrite(led_azul2, LOW);

    if (ph_alarme == false && estadoBotao == LOW && buzzer_ativo == false)
    {
      ph_alarme = true;
      buzzer_ativo = true; // Atualiza o estado do buzzer
    }

    if (ph_alarme == true)
    {
      tocarbuzzer();
    }
  }

  if (valor_pH >= 11) // Liga o LED azul se o PH estiver maior que 11
  {
    digitalWrite(led_vermelho2, HIGH);
    digitalWrite(led_verde2, HIGH);
    digitalWrite(led_azul2, LOW);

    if (ph_alarme == false && estadoBotao == LOW && buzzer_ativo == false)
    {
      ph_alarme = true;
      buzzer_ativo = true; // Atualiza o estado do buzzer
    }

    if (ph_alarme == true)
    {
      tocarbuzzer();
    }
  }

  if (3 <= valor_pH && valor_pH <= 6) // Liga o LED verde e vermelho (amarelo) se o PH estiver entre 3 e 6
  {
    digitalWrite(led_vermelho2, LOW);
    digitalWrite(led_verde2, LOW);
    digitalWrite(led_azul2, HIGH);

    if (ph_alarme == false && estadoBotao == LOW && buzzer_ativo == false)
    {
      ph_alarme = true;
      buzzer_ativo = true; // Atualiza o estado do buzzer
    }

    if (ph_alarme == true)
    {
      tocarbuzzer();
    }
  }

  if (valor_pH < 3) // Liga o LED vermelho se o PH estiver menor que 3
  {
    digitalWrite(led_vermelho2, LOW);
    digitalWrite(led_verde2, HIGH);
    digitalWrite(led_azul2, HIGH);

    if (ph_alarme == false && estadoBotao == LOW && buzzer_ativo == false)
    {
      ph_alarme = true;
      buzzer_ativo = true; // Atualiza o estado do buzzer
    }

    if (ph_alarme == true)
    {
      tocarbuzzer();
    }
  }

  if (valor_pH > 6 && valor_pH < 8) // Liga o LED verde se o PH estiver entre 6 e 8
  {
    digitalWrite(led_vermelho2, HIGH);
    digitalWrite(led_verde2, LOW);
    digitalWrite(led_azul2, HIGH);

    if (ph_alarme == true && temp_alarme == false && nivel_alarme == false)
    {
      digitalWrite(buzzer_pin, LOW); // Desativa o buzzer
      ph_alarme = false;
      buzzer_ativo = false; // Atualiza o estado do buzzer
    }
  }

  // ******************** FIM Sensor de PH ******************************** //




  // ******************* Sensor Nível de Água ***************************** //

  int waterLevel = digitalRead(sensorPin);

  if (waterLevel == LOW)
  {
    Serial.println("Nível de água normal.");

    if (nivel_alarme == true && temp_alarme == false && ph_alarme == false)
    {
      digitalWrite(buzzer_pin, LOW); // Desativa o buzzer
      nivel_alarme = false;
      buzzer_ativo = false; // Atualiza o estado do buzzer
    }
  }

  else
  {
    Serial.println("Nível de água baixo.");

    if (nivel_alarme == false && estadoBotao == LOW && buzzer_ativo == false)
    {
      nivel_alarme = true;
      buzzer_ativo = true; // Atualiza o estado do buzzer
    }

    if (nivel_alarme == true)
    {
      tocarbuzzer();
    }
  }

  // ******************* FIM Sensor Nível de Água ***************************** //

  delay(1000); // Aguarda um segundo antes da próxima leitura
  
  if (currentMillis - previousMillis >= interval) // Verifica se 1 minuto se passou
  {
    previousMillis = currentMillis; // Atualiza o tempo da última execução
    enviarDados(temperaturaC, valor_pH, waterLevel); // Enviar dados para o servidor
  }
}
