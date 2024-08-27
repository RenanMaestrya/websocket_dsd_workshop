# websocket_dsd_workshop

### "2. Em seguida, você deve seguir os passos descritos nas seções 7 e 8 da documentação a partir deste link. Após isso, escreva um texto explicando a solução implementada nessas seções."


A solução implementada garante que, mesmo após desconexões, os clientes recebam todas as mensagens enviadas enquanto estiveram offline. O servidor usa o serverOffset enviado pelo cliente para recuperar e enviar mensagens armazenadas no banco de dados desde o último ID conhecido. Além disso, o clientOffset ajuda a evitar a duplicação de mensagens no banco de dados. Essa abordagem melhora a sincronização e a resiliência da aplicação, assegurando uma experiência de chat mais consistente e eficiente.
