# Self-generated swamp ambience for Gatorline (no samples; pure synthesis with numpy). Public domain / CC0 by tkay.
import numpy as np, wave
sr=22050; T=24; n=sr*T; rng=np.random.default_rng(7)
t=np.arange(n)/sr
# 1) water/wind bed: brown noise, gently low-passed, looped by crossfade
w=np.cumsum(rng.standard_normal(n+sr)); w-=np.convolve(w,np.ones(2000)/2000,'same'); w/=np.abs(w).max()
bed=w[:n]*0.18
# 2) crickets: 4.6 kHz carrier, 30 Hz pulse trains in bursts
cr=np.zeros(n)
for k in range(3):
    f=4400+k*260; ph=rng.uniform(0,6)
    gate=(np.sin(2*np.pi*(0.55+0.1*k)*t+ph)>0.2).astype(float)
    pulse=(np.sin(2*np.pi*(28+3*k)*t)>0.6).astype(float)
    env=np.convolve(gate*pulse,np.hanning(60)/30,'same')
    cr+=np.sin(2*np.pi*f*t)*env*0.025
# 3) frog croaks: low harmonic grunts at random times
fr=np.zeros(n)
for s in rng.uniform(0.5,T-1.5,14):
    i=int(s*sr); L=int(rng.uniform(.18,.35)*sr); tt=np.arange(L)/sr; f0=rng.uniform(95,150)
    sig=sum(np.sin(2*np.pi*f0*h*tt)/h for h in range(1,6))*np.sin(np.pi*tt/tt[-1])**2*(0.5+0.5*np.sign(np.sin(2*np.pi*22*tt)))
    fr[i:i+L]+=sig*0.08
mix=bed+cr+fr
# seamless loop: crossfade last 1s into the start
x=sr; fade=np.linspace(0,1,x); mix[:x]=mix[:x]*fade+mix[-x:]*(1-fade); mix=mix[:-x]
mix=mix/np.abs(mix).max()*0.6
with wave.open('swamp.wav','wb') as f:
    f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes((mix*32767).astype('<i2').tobytes())
print('ok',len(mix)/sr,'s')
