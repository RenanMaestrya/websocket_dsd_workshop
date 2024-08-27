﻿# websocket_dsd_workshop

### "2. Em seguida, você deve seguir os passos descritos nas seções 7 e 8 da documentação a partir deste link. Após isso, escreva um texto explicando a solução implementada nessas seções."


Na implementação do sistema de chat, a principal preocupação foi garantir que o estado local dos clientes estivesse sempre sincronizado com o estado global mantido pelo servidor, mesmo em situações de falhas de conexão. Para atingir esse objetivo, o servidor foi configurado para recuperar e enviar as mensagens armazenadas no banco de dados sempre que um cliente se reconecta. Assim que um cliente se reconecta, o servidor consulta todas as mensagens que foram enviadas após o último identificador conhecido pelo cliente e as envia de volta para garantir que nenhuma mensagem seja perdida. Esse identificador, conhecido como serverOffset, é enviado pelo cliente durante a conexão e permite ao servidor saber a partir de qual ponto ele deve enviar as mensagens ausentes.

Além disso, ao lidar com novas mensagens enviadas pelos clientes, o servidor utiliza o clientOffset, um identificador associado a cada mensagem enviada. Esse identificador ajuda a evitar a duplicação de mensagens, pois o servidor verifica se a mensagem já foi registrada antes de inseri-la no banco de dados. Se uma mensagem com um clientOffset já existente for recebida, o servidor trata a situação como uma violação de restrição e responde de forma apropriada, garantindo que não haja mensagens duplicadas.

Essa abordagem proporciona uma solução robusta, minimizando a perda de mensagens e garantindo uma experiência de chat mais consistente, mesmo em casos de desconexão e reconexão dos clientes. A utilização do serverOffset e clientOffset facilita a sincronização eficiente e a escalabilidade do sistema, preparando-o para lidar com alta carga e possíveis falhas de forma eficaz. Dessa forma, a solução implementada melhora significativamente a resiliência e a robustez da aplicação de chat.
