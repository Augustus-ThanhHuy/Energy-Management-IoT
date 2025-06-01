#ifndef PZEM_H
#define PZEM_H

#include <stm32f1xx.h>
#include "main.h"
#include <stdbool.h>

typedef struct
{
    float voltage;   // điện áp
    float current;   // dòng điện
    float power;     // công suất
    float pf;        // hệ số công suất
    float frequency; // tần số
    float energy;    // năng lượng tiêu thụ
    uint16_t alarm;  // mã cảnh báo
} PZEM;

void pzem_Init(UART_HandleTypeDef *huart);
void pzem_READ(PZEM *pzemhandle);
bool pzem_CheckConnection(void);
#endif // PZEM_H