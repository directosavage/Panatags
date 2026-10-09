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
}

// Lightweight models optimized for in-browser client execution on mobile and desktop
export const AVAILABLE_MODELS = [
  {
    id: 'HuggingFaceTB/SmolLM2-135M-Instruct',
    name: 'SmolLM2 135M Instruct (Ultra Fast - ~90 MB)',
    description: 'Pinakamabilis sa cellphone; mababang konsumo ng baterya at RAM.',
    size: '~90 MB',
    recommendedFor: 'Mobile Phones & Low RAM'
  },
  {
    id: 'onnx-community/Qwen2.5-0.5B-Instruct',
    name: 'Qwen 2.5 0.5B Instruct (Smart & Compact - ~350 MB)',
    description: 'Mas matalino sa pagsusuri ng komplikadong emergency scenarios.',
    size: '~350 MB',
    recommendedFor: 'Laptops & Modern Smartphones'
  }
];

class LocalModelService {
  private generator: any = null;
  private currentModelId: string = 'HuggingFaceTB/SmolLM2-135M-Instruct';
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
   * Downloads and initializes the local model into browser cache/IndexedDB
   */
  public async loadModel(modelId?: string): Promise<boolean> {
    if (modelId) {
      this.currentModelId = modelId;
    }

    if (this.status === 'downloading' || this.status === 'loading') {
      return false;
    }

    this.status = 'downloading';
    this.progress = { status: 'Sinisimulan ang pag-download...' };
    this.notify();

    try {
      const device = this.hasWebGPU ? 'webgpu' : 'wasm';
      const dtype = this.hasWebGPU ? 'fp16' : 'q4';

      this.generator = await pipeline('text-generation', this.currentModelId, {
        dtype: dtype as any,
        device: device as any,
        progress_callback: (p: any) => {
          this.progress = {
            status: p.status || 'Nagda-download...',
            name: p.name,
            file: p.file,
            progress: typeof p.progress === 'number' ? Math.round(p.progress) : undefined,
            loaded: p.loaded,
            total: p.total
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
      console.warn('WebGPU/ONNX pipeline load error, retrying with WASM:', err);
      // Fallback to WASM/q4 if WebGPU failed
      try {
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
        console.error('Local model initialization failed:', fallbackErr);
        this.status = 'error';
        this.progress = { status: 'Error sa pag-download: ' + (fallbackErr.message || 'Network / Memory issue') };
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

    // System instruction calibrated for Philippine disasters
    const messages = [
      {
        role: 'system',
        content: `You are Panatag, an offline Philippine disaster buddy and emergency safety assistant. You provide concise, life-saving advice in Filipino (Tagalog) or English for typhoons, earthquakes, floods, fires, and first aid based on NDRRMC, PAGASA, and Philippine Red Cross protocols.`
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
      max_new_tokens: 256,
      temperature: 0.3,
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
