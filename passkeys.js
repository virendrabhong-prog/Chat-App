/* WebAuthn browser helper. Requires the companion Firebase Cloud Function in /functions. */
(function(){
  const api=()=>window.PASSKEY_API_BASE;
  const toBuffer=s=>{const b=atob(s.replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(b,c=>c.charCodeAt(0)).buffer;};
  const toB64=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  async function post(path,data,token){if(!api())throw new Error('Set PASSKEY_API_BASE in firebase-config.js after deploying the passkey function.');const r=await fetch(api().replace(/\/$/,'')+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(data||{})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Passkey request failed.');return j;}
  function creationOptions(o){o.challenge=toBuffer(o.challenge);o.user.id=toBuffer(o.user.id);(o.excludeCredentials||[]).forEach(c=>c.id=toBuffer(c.id));return o;}
  function requestOptions(o){o.challenge=toBuffer(o.challenge);(o.allowCredentials||[]).forEach(c=>c.id=toBuffer(c.id));return o;}
  function attestation(c){return {id:c.id,rawId:toB64(c.rawId),type:c.type,response:{attestationObject:toB64(c.response.attestationObject),clientDataJSON:toB64(c.response.clientDataJSON),transports:c.response.getTransports?c.response.getTransports():[]},clientExtensionResults:c.getClientExtensionResults()};}
  function assertion(c){return {id:c.id,rawId:toB64(c.rawId),type:c.type,response:{authenticatorData:toB64(c.response.authenticatorData),clientDataJSON:toB64(c.response.clientDataJSON),signature:toB64(c.response.signature),userHandle:c.response.userHandle?toB64(c.response.userHandle):null},clientExtensionResults:c.getClientExtensionResults()};}
  window.chatPasskeys={
    async register(user){if(!window.PublicKeyCredential||!navigator.credentials)throw new Error('This browser does not support passkeys.');const token=await user.getIdToken();const {options,sessionId}=await post('/register/options',{},token);const credential=await navigator.credentials.create({publicKey:creationOptions(options)});await post('/register/verify',{sessionId,response:attestation(credential)},token);},
    async signIn(email,auth){if(!window.PublicKeyCredential||!navigator.credentials)throw new Error('This browser does not support passkeys.');const {options,sessionId}=await post('/auth/options',{email});const credential=await navigator.credentials.get({publicKey:requestOptions(options)});const {customToken}=await post('/auth/verify',{sessionId,response:assertion(credential)});await auth.signInWithCustomToken(customToken);}
  };
})();
