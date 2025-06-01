#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <wiringPi.h>
#include <wiringSerial.h>
#include <pthread.h>
#include <unistd.h>
#include <curl/curl.h>
#include <cjson/cJSON.h>
#include <termios.h>
#include <signal.h>

#define SERIAL_PORT "/dev/ttyAMA0"
#define BAUD_RATE 9600
#define MAX_BUFFER_SIZE 4096

typedef enum {
    STATE_IDLE,
    STATE_RECEIVE_UART,
    STATE_SEND_TO_SERVER,
    STATE_CHECK_CONTROL,
    STATE_SEND_CONTROL
} system_state_t;

volatile system_state_t system_state = STATE_IDLE;

int fd = -1;

// Dữ liệu cảm biến cho cả 2 module
typedef struct {
    char ID[20];
    float Temperature;
    float Humidity;
    float Energy;
    float Voltage;
    float Current;
    float Power;
    int data_updated;
} sensor_data_t;

sensor_data_t r1_data = {"R1", 0, 0, 0, 0, 0, 0, 0};
sensor_data_t r2_data = {"R2", 0, 0, 0, 0, 0, 0, 0};


// Các biến điều khiển cho cả 2 phòng
int last_room1_lamp1 = -1;
int last_room2_lamp1 = -1;
volatile int control_event_triggered = 0;
char control_target[10] = ""; // "room1" hoặc "room2"

char loraPacket[100];

// Callback "nhặt" response vào biến rác để tránh in ra stdout
size_t write_callback_silent(void *ptr, size_t size, size_t nmemb, void *userdata) {
    return size * nmemb;
}

// Signal handler cho ngắt phần mềm
void signal_handler(int signum) {
    if (signum == SIGUSR1) {
        control_event_triggered = 1;
    }
}

// Hàm nhận dữ liệu UART - Cải tiến để xử lý cả R1 và R2
void receive_uart_data() {
    char buffer[256];
    int i = 0;
    while (serialDataAvail(fd)) {
        char c = serialGetchar(fd);
        if (c == '\n' || c == '\r') {
            buffer[i] = '\0';
            
            // Parse dữ liệu
            char temp_id[20];
            float temp_t, temp_h, temp_e, temp_v, temp_c, temp_p;
            
            if (sscanf(buffer, "ID:%[^,],T:%f,H:%f,E:%f,C:%f,V:%f,P:%f",
                      temp_id, &temp_t, &temp_h, &temp_e, &temp_c, &temp_v, &temp_p) == 7) {
                
                        
                // Phân biệt dữ liệu từ R1 hay R2
                if (strcmp(temp_id, "R1") == 0) {
                    strcpy(r1_data.ID, temp_id);
                    r1_data.Temperature = temp_t;
                    r1_data.Humidity = temp_h;
                    r1_data.Energy = temp_e;
                    r1_data.Current = temp_c;
                    r1_data.Voltage = temp_v;
                    r1_data.Power = temp_p;
                    r1_data.data_updated = 1;
                    printf("Received R1: %s\n", buffer);
                } else if (strcmp(temp_id, "R2") == 0) {
                    strcpy(r2_data.ID, temp_id);
                    r2_data.Temperature = temp_t;
                    r2_data.Humidity = temp_h;
                    r2_data.Energy = temp_e;
                    r2_data.Current = temp_c;
                    r2_data.Voltage = temp_v;
                    r2_data.Power = temp_p;
                    r2_data.data_updated = 1;
                    printf("Received R2: %s\n", buffer);
                }
                
            }
            i = 0;
        } else {
            if (i < sizeof(buffer) - 1) buffer[i++] = c;
        }
    }
}

// Hàm gửi dữ liệu lên server (POST) - Cải tiến để gửi cả R1 và R2
int send_data_to_server() {
    int success_count = 0;
    
    
    // Gửi dữ liệu R1 nếu có update
    if (r1_data.data_updated) {
        CURL *curl = curl_easy_init();
        if (curl) {
            char json_data[512];
            snprintf(json_data, sizeof(json_data),
                     "{\"ID\":\"%s\",\"Temperature\":\"%.2f\",\"Humidity\":\"%.2f\","
                     "\"Energy\":\"%.2f\",\"Current\":\"%.2f\",\"Voltage\":\"%.2f\","
                     "\"Power\":\"%.2f\"}",
                     r1_data.ID, r1_data.Temperature, r1_data.Humidity, 
                     r1_data.Energy, r1_data.Current, r1_data.Voltage, r1_data.Power);

            struct curl_slist *headers = NULL;
            headers = curl_slist_append(headers, "Content-Type: application/json");

            curl_easy_setopt(curl, CURLOPT_URL, "http://raspberrypi.local/api/postData.php");
            curl_easy_setopt(curl, CURLOPT_POST, 1L);
            curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data);
            curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);
            curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback_silent);
            
            CURLcode res = curl_easy_perform(curl);
            if (res == CURLE_OK) {
                r1_data.data_updated = 0;
                success_count++;
                printf("[HTTP R1]: %s\n", json_data);
            }

            curl_slist_free_all(headers);
            curl_easy_cleanup(curl);
        }
    }

    // Gửi dữ liệu R2 nếu có update
    if (r2_data.data_updated) {
        CURL *curl = curl_easy_init();
        if (curl) {
            char json_data[512];
            snprintf(json_data, sizeof(json_data),
                     "{\"ID\":\"%s\",\"Temperature\":\"%.2f\",\"Humidity\":\"%.2f\","
                     "\"Energy\":\"%.2f\",\"Current\":\"%.2f\",\"Voltage\":\"%.2f\","
                     "\"Power\":\"%.2f\"}",
                     r2_data.ID, r2_data.Temperature, r2_data.Humidity, 
                     r2_data.Energy, r2_data.Current, r2_data.Voltage, r2_data.Power);

            struct curl_slist *headers = NULL;
            headers = curl_slist_append(headers, "Content-Type: application/json");

            curl_easy_setopt(curl, CURLOPT_URL, "http://raspberrypi.local/api/postData.php");
            curl_easy_setopt(curl, CURLOPT_POST, 1L);
            curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data);
            curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);
            curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback_silent);
            
            CURLcode res = curl_easy_perform(curl);
            if (res == CURLE_OK) {
                r2_data.data_updated = 0;
                success_count++;
                printf("[HTTP R2]: %s\n", json_data);
            }

            curl_slist_free_all(headers);
            curl_easy_cleanup(curl);
        }
    }
    
    return success_count > 0 ? 0 : -1;
}

// Hàm kiểm tra trạng thái điều khiển từ server (GET) - Cải tiến cho cả 2 phòng
int check_control_event() {
    CURL *curl = curl_easy_init();
    if (!curl) return -1;

    char response[MAX_BUFFER_SIZE] = {0};
    size_t write_callback(void *ptr, size_t size, size_t nmemb, void *userdata) {
        size_t realsize = size * nmemb;
        if (realsize + strlen(response) >= MAX_BUFFER_SIZE) return 0;
        strncat(response, ptr, realsize);
        return realsize;
    }

    curl_easy_setopt(curl, CURLOPT_URL, "http://raspberrypi.local/api/get_control.php");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, NULL);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 5L);

    CURLcode res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        fprintf(stderr, "Check control error: %s\n", curl_easy_strerror(res));
        curl_easy_cleanup(curl);
        return -1;
    }

    curl_easy_cleanup(curl);

    cJSON *json = cJSON_Parse(response);
    if (!json) return -1;

    
    // Kiểm tra room1_lamp1
    cJSON *room1_lamp1 = cJSON_GetObjectItem(json, "room1_lamp1");
    if (room1_lamp1 && cJSON_IsNumber(room1_lamp1)) {
        if (room1_lamp1->valueint != last_room1_lamp1) {
            last_room1_lamp1 = room1_lamp1->valueint;
            control_event_triggered = 1;
            strcpy(control_target, "room1");
            printf("Control event detected: room1_lamp1=%d\n", last_room1_lamp1);
            kill(getpid(), SIGUSR1);
        }
    }

    // Kiểm tra room2_lamp1
    cJSON *room2_lamp1 = cJSON_GetObjectItem(json, "room2_lamp1");
    if (room2_lamp1 && cJSON_IsNumber(room2_lamp1)) {
        if (room2_lamp1->valueint != last_room2_lamp1) {
            last_room2_lamp1 = room2_lamp1->valueint;
            control_event_triggered = 1;
            strcpy(control_target, "room2");
            printf("Control event detected: room2_lamp1=%d\n", last_room2_lamp1);
            kill(getpid(), SIGUSR1);
        }
    }
    
    cJSON_Delete(json);
    return 0;
}

// Thread kiểm tra điều khiển từ server
void *control_check_thread(void *arg) {
    while (1) {
        check_control_event();
        usleep(500 * 1000); // Kiểm tra mỗi 500ms
    }
    return NULL;
}

// Gửi lệnh điều khiển qua LoRa - Cải tiến để hỗ trợ cả R1 và R2
void send_control_command() {
    int packetLen = 0;
    const unsigned char LORA_HIGH_ADDR = 0x00;
    unsigned char LORA_LOW_ADDR;
    unsigned char LORA_CHANNEL;
    unsigned char command_value;
    
    
    // Xác định địa chỉ LoRa và lệnh dựa trên target
    if (strcmp(control_target, "room1") == 0) {
        LORA_LOW_ADDR = 0x82;  // Địa chỉ LoRa R1
        LORA_CHANNEL = 0x0C;
        command_value = (last_room1_lamp1 == 1) ? 0x01 : 0x00;
    } else if (strcmp(control_target, "room2") == 0) {
        LORA_LOW_ADDR = 0x87;  // Địa chỉ LoRa R2
        LORA_CHANNEL = 0x0D;
        command_value = (last_room2_lamp1 == 1) ? 0x01 : 0x00;
    } else {
        return; // Không có target hợp lệ
    }
    
    // Tạo packet LoRa
    loraPacket[packetLen++] = LORA_HIGH_ADDR;
    loraPacket[packetLen++] = LORA_LOW_ADDR;
    loraPacket[packetLen++] = LORA_CHANNEL;
    loraPacket[packetLen++] = command_value;

    // Gửi packet qua UART
    if (fd >= 0) {
        for (int i = 0; i < packetLen; i++) {
            serialPutchar(fd, loraPacket[i]);
            usleep(1000);
        }
        tcdrain(fd);
        printf("Sent control command to %s: lamp1 %s (Addr: 0x%02X, Ch: 0x%02X)\n", 
               control_target, 
               command_value ? "ON" : "OFF",
               LORA_LOW_ADDR, 
               LORA_CHANNEL);
    }
    
}

int main() {
    curl_global_init(CURL_GLOBAL_ALL);

    // Đăng ký signal handler
    signal(SIGUSR1, signal_handler);

    if (wiringPiSetup() == -1) {
        fprintf(stderr, "WiringPi setup error: %s\n", strerror(errno));
        return 1;
    }

    if ((fd = serialOpen(SERIAL_PORT, BAUD_RATE)) < 0) {
        fprintf(stderr, "Can't open UART: %s\n", strerror(errno));
        return 1;
    }

    // Tạo thread kiểm tra điều khiển
    pthread_t control_thread;
    if (pthread_create(&control_thread, NULL, control_check_thread, NULL) != 0) {
        fprintf(stderr, "Failed to create control thread: %s\n", strerror(errno));
        return 1;
    }

    while (1) {
        static int tick = 0;
        switch (system_state) {
            case STATE_IDLE:
                if (serialDataAvail(fd) > 0) {
                    system_state = STATE_RECEIVE_UART;
                } else if (r1_data.data_updated || r2_data.data_updated) {
                    system_state = STATE_SEND_TO_SERVER;
                } else if (control_event_triggered) {
                    system_state = STATE_SEND_CONTROL;
                } else {
                    tick++;
                    if (tick >= 1) { 
                        system_state = STATE_CHECK_CONTROL;
                        tick = 0;
                    }
                }
                break;

            case STATE_RECEIVE_UART:
                receive_uart_data();
                system_state = STATE_IDLE;
                break;

            case STATE_SEND_TO_SERVER:
                send_data_to_server();
                system_state = STATE_IDLE;
                break;

            case STATE_CHECK_CONTROL:
                check_control_event();
                system_state = STATE_IDLE;
                break;

            case STATE_SEND_CONTROL:
                send_control_command();
                control_event_triggered = 0;
                strcpy(control_target, ""); // Reset target
                system_state = STATE_IDLE;
                break;
        }
        usleep(200 * 1000); // Delay 200ms
    }

    curl_global_cleanup();
    serialClose(fd);
    return 0;
}