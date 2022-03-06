
const messageToSender = (NAMESPACE, context) => (event) => {
  try{
    console.log(event)
    context.sendCustomMessage(NAMESPACE, event.senderId, event)
  }catch(error){
    console.log(`ERROR :${error}`)
  }
}

export const messageToSenderBuilder = (NAMESPACE, context) => {
  console.log ('building messageToSender')
  return messageToSender(NAMESPACE, context)
}