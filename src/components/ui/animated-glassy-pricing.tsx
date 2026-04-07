import React, { useRef, useEffect, useState } from 'react';
import { RippleButton } from "@/components/ui/multi-type-ripple-buttons";

// --- Internal Helper Components (Not exported) --- //

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShaderCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glProgramRef = useRef<WebGLProgram | null>(null);
  const glBgColorLocationRef = useRef<WebGLUniformLocation | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const [backgroundColor, setBackgroundColor] = useState([0.04, 0.04, 0.04]); // Default Dark

  useEffect(() => {
    // Force dark themed background for Oracle theme
    setBackgroundColor([0.04, 0.04, 0.04]);
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const program = glProgramRef.current;
    const location = glBgColorLocationRef.current;
    if (gl && program && location) {
      gl.useProgram(program);
      gl.uniform3fv(location, new Float32Array(backgroundColor));
    }
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) { console.error("WebGL not supported"); return; }
    glRef.current = gl;

    const vertexShaderSource = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
    const fragmentShaderSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uBackgroundColor;
      mat2 rotate2d(float angle){ float c=cos(angle),s=sin(angle); return mat2(c,-s,s,c); }
      float variation(vec2 v1,vec2 v2,float strength,float speed){ return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0; }
      vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff = center-uv;
        float len = length(diff);
        len += variation(diff,vec2(0.,1.),5.,2.);
        len -= variation(diff,vec2(1.,0.),5.,2.);
        float circle = smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
        return vec3(circle);
      }
      void main(){
        vec2 uv = gl_FragCoord.xy/iResolution.xy;
        uv.x *= 1.5; uv.x -= 0.25;
        float mask = 0.0;
        float radius = .35;
        vec2 center = vec2(.5);
        mask += paintCircle(uv,center,radius,.035).r;
        mask += paintCircle(uv,center,radius-.018,.01).r;
        mask += paintCircle(uv,center,radius+.018,.005).r;
        vec2 v=rotate2d(iTime)*uv;
        // Adapted to Gold/Luxury theme colors: Gold, Bronze, Black
        vec3 foregroundColor=vec3(0.83, 0.68, 0.21) * (v.x + 0.5) + vec3(0.54, 0.42, 0.25) * (v.y + 0.5);
        vec3 color=mix(uBackgroundColor,foregroundColor,mask);
        color=mix(color,vec3(1., 0.84, 0.),paintCircle(uv,center,radius,.003).r);
        gl_FragColor=vec4(color,1.);
      }`;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Could not create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || "Shader compilation error");
      }
      return shader;
    };

    const program = gl.createProgram();
    if (!program) throw new Error("Could not create program");
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    glProgramRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResLoc = gl.getUniformLocation(program, 'iResolution');
    glBgColorLocationRef.current = gl.getUniformLocation(program, 'uBackgroundColor');
    gl.uniform3fv(glBgColorLocationRef.current, new Float32Array(backgroundColor));

    let animationFrameId: number;
    const render = (time: number) => {
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full block z-0 bg-background" />;
};


// --- EXPORTED Building Blocks --- //

export interface PricingCardProps {
  planName: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const PricingCard = ({
  planName, description, price, features, buttonText, isPopular = false, buttonVariant = 'primary', onClick
}: PricingCardProps) => {
  const cardClasses = `
    backdrop-blur-[14px] bg-gradient-to-br rounded-2xl shadow-xl flex-1 max-w-sm px-6 py-8 flex flex-col transition-all duration-300
    from-brand-gold/10 to-transparent border border-brand-gold/20
    dark:from-brand-gold/15 dark:to-black/30 dark:border-brand-gold/10 dark:backdrop-brightness-[0.95]
    ${isPopular ? 'scale-105 relative ring-2 ring-brand-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] overflow-hidden' : ''}
  `;
  const buttonClasses = `
    mt-auto w-full py-2.5 rounded-xl font-bold text-[14px] transition uppercase tracking-wider
    ${buttonVariant === 'primary' 
      ? 'bg-brand-gold hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
      : 'bg-white/5 hover:bg-white/10 text-white border border-white/20'
    }
  `;

  return (
    <div className={cardClasses.trim()}>
      {isPopular && (
        <div className="absolute -top-1 -right-1">
           <div className="bg-brand-gold text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-tighter">
             En Popüler
           </div>
        </div>
      )}
      <div className="mb-3">
        <h2 className="text-[32px] font-bold tracking-tight text-brand-gold font-display">{planName}</h2>
        <p className="text-[14px] text-white/60 mt-1">{description}</p>
      </div>
      <div className="my-6 flex items-baseline gap-1">
        <span className="text-[40px] font-extrabold text-white">{price}</span>
        <span className="text-[14px] text-white/50">/tek seferlik</span>
      </div>
      <div className="w-full mb-5 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"></div>
      <ul className="flex flex-col gap-3 text-[13px] text-white/80 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckIcon className="text-brand-gold w-4 h-4 shrink-0" /> {feature}
          </li>
        ))}
      </ul>
      <RippleButton className={buttonClasses.trim()} onClick={onClick}>{buttonText}</RippleButton>
    </div>
  );
};


// --- EXPORTED Customizable Page Component --- //

interface ModernPricingPageProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  plans: PricingCardProps[];
  showAnimatedBackground?: boolean;
  onClose?: () => void;
}

export const ModernPricingPage = ({
  title,
  subtitle,
  plans,
  showAnimatedBackground = true,
  onClose
}: ModernPricingPageProps) => {
  return (
    <div className="bg-black text-white min-h-screen w-full relative overflow-y-auto">
      {showAnimatedBackground && <ShaderCanvas />}
      
      {onClose && (
        <button 
          onClick={onClose}
          className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90"
        >
          ✕
        </button>
      )}

      <main className="relative w-full py-16 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-5xl mx-auto text-center mb-16">
          <h1 className="text-[40px] md:text-[56px] font-black leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-brand-gold via-yellow-200 to-brand-bronze drop-shadow-sm">
            {title}
          </h1>
          <p className="mt-4 text-[16px] md:text-[18px] text-white/70 max-w-2xl mx-auto italic font-medium">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl items-stretch">
          {plans.map((plan) => (
            <div key={plan.planName} className="flex h-full">
              <PricingCard {...plan} />
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center text-white/40 text-sm">
          <p>Tüm işlemler 256-bit SSL sertifikası ile korunmaktadır.</p>
          <p className="mt-1">© 2026 NAI Oracle - Cosmic Wisdom Platforms</p>
        </div>
      </main>
    </div>
  );
};
