import { pipeline, env, TextStreamer } from '@huggingface/transformers';

// Configure transformers for browser environment
env.allowLocalModels = false;
env.useBrowserCache = true;

export type ModelStatus = 'not_downloaded' | 'downloading' | 'loading' | 'ready' | 'error';

export interface DownloadProgress {
  status: string;
  name?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
  loadedMB?: string;
  totalMB?: string;
}

// User-specified models from HuggingFace
export const AVAILABLE_MODELS = [
  {
    id: 'litert-community/gemma-4-E2B-it-litert-lm',
    name: 'Google Gemma 4 E2B IT (LiteRT-LM) - 2.58 GB',
    description: 'Ang opisyal na 2.58 GB Google AI Edge Gemma 4 model mula sa Hugging Face link mo.',
    size: '2.58 GB',
    url: 'https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm',
    recommendedFor: 'Full Intelligence (Laptops / High-End Phones)'
  },
  {
    id: 'onnx-community/Qwen2.5-0.5B-Instruct',
    name: 'Qwen 2.5 0.5B Instruct - ~350 MB',
    description: 'Mabilis na on-device LLM na may malalim na medical at disaster reasoning.',
    size: '~350 MB',
    url: 'https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct',
    recommendedFor: 'Mid-Range Smartphones'
  },
  {
    id: 'HuggingFaceTB/SmolLM2-135M-Instruct',
    name: 'SmolLM2 135M Instruct - ~90 MB',
    description: 'Pinakamabilis na i-download sa mahinang signal; mababang RAM.',
    size: '~90 MB',
    url: 'https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct',
    recommendedFor: 'Quick Download & Low RAM'
  }
];

class LocalModelService {
  private generator: any = null;
  private currentModelId: string = 'litert-community/gemma-4-E2B-it-litert-lm';
  private status: ModelStatus = 'not_downloaded';
  private progress: DownloadProgress = { status: '' };
  private listeners: Array<() => void> = [];
  private hasWebGPU: boolean = false;

  constructor() {
    this.checkWebGPU();
    this.checkIfModelCached();
  }

  private async checkWebGPU() {
    if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
      try {
        const adapter = await (navigator as any).gpu.requestAdapter();
        this.hasWebGPU = !!adapter;
      } catch {
        this.hasWebGPU = false;
      }
    }
  }

  private async checkIfModelCached() {
    try {
      const isCached = localStorage.getItem(`panatag_model_cached_${this.currentModelId}`);
      if (isCached === 'true') {
        this.status = 'ready';
        this.notify();
      }
    } catch {
      // ignore
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getStatus(): ModelStatus {
    return this.status;
  }

  public getProgress(): DownloadProgress {
    return this.progress;
  }

  public getSelectedModelId(): string {
    return this.currentModelId;
  }

  public isUsingWebGPU(): boolean {
    return this.hasWebGPU;
  }

  /**
   * Downloads model weights from Hugging Face directly into device storage
   */
  public async loadModel(modelId?: string): Promise<boolean> {
    if (modelId) {
      this.currentModelId = modelId;
    }

    if (this.status === 'downloading' || this.status === 'loading') {
      return false;
    }

    this.status = 'downloading';
    this.progress = { status: 'Kumokonekta sa Hugging Face...' };
    this.notify();

    try {
      const device = this.hasWebGPU ? 'webgpu' : 'wasm';
      const dtype = this.hasWebGPU ? 'fp16' : 'q4';

      this.generator = await pipeline('text-generation', this.currentModelId, {
        dtype: dtype as any,
        device: device as any,
        progress_callback: (p: any) => {
          const loadedMB = p.loaded ? (p.loaded / (1024 * 1024)).toFixed(1) : undefined;
          const totalMB = p.total ? (p.total / (1024 * 1024)).toFixed(1) : undefined;

          this.progress = {
            status: p.status || 'Nagda-download ng weights...',
            name: p.name,
            file: p.file,
            progress: typeof p.progress === 'number' ? Math.round(p.progress) : undefined,
            loaded: p.loaded,
            total: p.total,
            loadedMB: loadedMB ? `${loadedMB} MB` : undefined,
            totalMB: totalMB ? `${totalMB} MB` : undefined
          };
          this.notify();
        }
      });

      this.status = 'ready';
      try {
        localStorage.setItem(`panatag_model_cached_${this.currentModelId}`, 'true');
      } catch {
        // ignore
      }
      this.notify();
      return true;
    } catch (err: any) {
      console.warn('Initial download/load attempt failed, trying fallback runner:', err);
      try {
        // Fallback to WASM
        this.generator = await pipeline('text-generation', this.currentModelId, {
          dtype: 'q4' as any,
          device: 'wasm' as any,
          progress_callback: (p: any) => {
            this.progress = {
              status: p.status || 'Nagda-download...',
              file: p.file,
              progress: typeof p.progress === 'number' ? Math.round(p.progress) : undefined
            };
            this.notify();
          }
        });
        this.status = 'ready';
        this.notify();
        return true;
      } catch (fallbackErr: any) {
        console.error('Model download error:', fallbackErr);
        this.status = 'error';
        this.progress = { 
          status: 'Hindi natapos ang download: ' + (fallbackErr.message || 'Kulang sa RAM / storage') 
        };
        this.notify();
        return false;
      }
    }
  }

  /**
   * Generates text completely offline using the loaded local model
   */
  public async generate(prompt: string, onToken?: (token: string) => void): Promise<string> {
    if (!this.generator) {
      throw new Error('Local model is not yet loaded.');
    }

    const messages = [
      {
        role: 'system',
        content: `You are Panatag, a life-saving offline Philippine emergency medical and disaster assistant. Answer urgent trauma and disaster questions in concise, authoritative Filipino or English. If an injury is life-threatening (like severed limbs, severe bleeding, or burns), provide immediate direct medical action without reciting survival checklists.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    let fullOutput = '';
    const streamer = onToken
      ? new TextStreamer(this.generator.tokenizer, {
          skip_prompt: true,
          callback_function: (tokenText: string) => {
            fullOutput += tokenText;
            onToken(fullOutput);
          }
        })
      : undefined;

    const output = await this.generator(messages, {
      max_new_tokens: 300,
      temperature: 0.2,
      streamer
    });

    if (output && output[0]?.generated_text) {
      const generated = output[0].generated_text;
      if (Array.isArray(generated)) {
        const lastMsg = generated[generated.length - 1];
        return lastMsg.content || fullOutput;
      }
      return fullOutput || String(generated);
    }

    return fullOutput;
  }
}

export const localModelService = new LocalModelService();
