import { CareerRoadmap, WeakTopicItem } from '../types';

export const SAMPLE_AI_ROADMAP: CareerRoadmap = {
  id: 'roadmap-ai-engineer-demo',
  jobTitle: 'AI & Machine Learning Engineer',
  skillLevel: 'Intermediate',
  targetDuration: '8 weeks',
  dailyTime: '2h',
  existingSkills: ['Python', 'Basic Linear Algebra', 'NumPy'],
  createdAt: '2026-10-20T09:00:00Z',
  updatedAt: '2026-10-28T08:00:00Z',
  totalDays: 28,
  summary: 'A comprehensive 28-day intensive track transitioning from tensor fundamentals to production LLMs, Vector Search, and Retrieval-Augmented Generation (RAG).',
  stages: [
    {
      id: 'stage-1',
      stageNumber: 1,
      title: 'Stage 1: Tensor Computation & Deep Learning Foundations',
      description: 'Master PyTorch tensor dynamics, automatic differentiation, neural network architecture, and gradient optimization.',
      estimatedWeeks: 2,
      topics: ['Tensors & Autograd', 'Loss Functions & Optimization', 'CNNs & Computer Vision', 'Recurrent & Attention Mechanisms', 'Model Evaluation'],
      capstoneProject: {
        title: 'Custom Deep Neural Classifier & Performance Profiler',
        description: 'Build and train a multi-layer deep network from scratch in PyTorch with custom CUDA-accelerated loss functions and validation logging.',
        deliverables: ['Custom PyTorch Dataset & DataLoader', 'Training loop with Early Stopping', 'Confusion matrix & ROC curve report'],
      },
      lessons: [
        {
          id: 'lesson-d1',
          dayNumber: 1,
          stageId: 'stage-1',
          stageName: 'Stage 1: Tensor Computation & Foundations',
          title: 'Day 1: PyTorch Tensors, Memory Layout & GPU Acceleration',
          summary: 'Understand the internal representation of multi-dimensional tensors, stride arrays, and asynchronous CUDA memory transfers.',
          estimatedMinutes: 60,
          isCompleted: true,
          completedAt: '2026-10-21T18:30:00Z',
          objectives: [
            'Differentiate between row-major storage contiguous arrays and strided memory views.',
            'Execute explicit device allocations and non-blocking tensor transfers to CUDA/MPS.',
            'Perform tensor broadcasting and matrix multiplications using optimized BLAS routines.',
          ],
          contentMarkdown: `### 1. The Anatomy of a Tensor
In modern deep learning, a **Tensor** is a multidimensional array accompanied by metadata describing its data type (\`dtype\`), dimensions (\`shape\`), and memory layout (\`stride\`).

Unlike naive nested Python lists, PyTorch stores tensor numerical data in a single contiguous block of physical RAM or VRAM. Operations such as transpose (\`.T\`) or slice do not copy underlying memory; they simply adjust the stride matrix.

\`\`\`python
import torch

# Create a contiguous 2D float32 tensor
x = torch.randn(3, 4, dtype=torch.float32, device="cuda" if torch.cuda.is_available() else "cpu")
print(f"Shape: {x.shape}, Strides: {x.stride()}, Is Contiguous: {x.is_contiguous()}")

# Transposition modifies strides, not underlying memory storage
x_transposed = x.t()
print(f"Transposed Strides: {x_transposed.stride()}, Contiguous: {x_transposed.is_contiguous()}")
\`\`\`

### 2. Device Management & Best Practices
Always avoid implicit CPU-GPU synchronization bottlenecks in high-throughput training pipelines:
- Use \`tensor.to(device, non_blocking=True)\` in combination with \`pin_memory=True\` in \`DataLoader\`.
- Never access \`.item()\` inside latency-sensitive inner loops, as it triggers a CPU fence synchronization.`,
          codeSnippet: {
            language: 'python',
            code: `import torch

def create_efficient_batch(batch_size=64, features=128):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    # Allocating directly on device avoids unnecessary CPU->GPU bridge latency
    x = torch.empty((batch_size, features), device=device, dtype=torch.float32)
    torch.nn.init.xavier_uniform_(x)
    return x`,
            description: 'Direct VRAM allocation pattern avoiding CPU transfer overhead'
          },
          keyTakeaways: [
            'Strides define the number of memory elements to skip to advance one index in a dimension.',
            'Calling .contiguous() reallocates memory into sequential order, necessary before calling .view().',
            'Broadcasting automatically expands trailing singleton dimensions without memory duplication.'
          ],
          videoResource: {
            youtubeId: 'c36lUUr864M',
            title: 'PyTorch for Deep Learning & GPU Tensor Mechanics',
            channel: 'freeCodeCamp',
            duration: '1 hr 30 min',
            summary: 'Comprehensive hands-on breakdown of tensor creation, stride arrays, and CUDA device management.'
          },
          resources: [
            {
              id: 'res-d1-1',
              title: 'PyTorch Official Tensor Internals & Stride Mechanics',
              url: 'https://pytorch.org/docs/stable/tensors.html',
              type: 'documentation',
              duration: '25 min',
              isFree: true
            },
            {
              id: 'res-d1-2',
              title: 'CUDA Memory Hierarchy & GPU Pinning Explained',
              url: 'https://developer.nvidia.com/blog',
              type: 'article',
              duration: '15 min',
              isFree: true
            }
          ],
          tasks: [
            {
              id: 'task-d1-1',
              title: 'Verify Tensor Stride Transformations',
              description: 'Create a 4x4 matrix, transpose it, and verify how strides change. Call .view(-1) to observe why non-contiguous tensors fail without .reshape() or .contiguous().',
              instructions: [
                'Initialize a torch.arange(16).reshape(4, 4)',
                'Transpose using .t() and print .stride()',
                'Demonstrate the runtime error when calling .view(16)',
                'Fix the error using .contiguous().view(16)'
              ],
              completed: true
            },
            {
              id: 'task-d1-2',
              title: 'Benchmark CPU vs CUDA Matrix Multiplication',
              description: 'Compare execution time of multiplying two 2048x2048 float32 matrices on CPU vs GPU.',
              instructions: [
                'Use time.perf_counter() around torch.matmul',
                'Ensure torch.cuda.synchronize() is called before stopping the timer on GPU'
              ],
              completed: true
            }
          ],
          quizQuestions: [
            {
              id: 'q-d1-1',
              question: 'Why does calling .view() on a transposed PyTorch tensor raise a RuntimeError?',
              options: [
                'Transposing a tensor changes its data type to double precision',
                'Transposing alters the strides such that the underlying memory is no longer contiguous',
                'PyTorch disables .view() on any tensor that has rank greater than 1',
                '.view() requires an explicit GPU context manager'
              ],
              correctAnswerIndex: 1,
              explanation: '.view() operates only on contiguous memory blocks. Because transposing changes the stride metadata without rearranging physical memory, .contiguous() or .reshape() must be used.',
              topicTag: 'Tensors & Autograd'
            },
            {
              id: 'q-d1-2',
              question: 'Which method should you use to convert a non-contiguous tensor into a contiguous block in memory?',
              options: [
                'tensor.contiguous()',
                'tensor.flatten()',
                'tensor.align()',
                'tensor.squeeze()'
              ],
              correctAnswerIndex: 0,
              explanation: 'tensor.contiguous() creates a contiguous copy of the tensor with standard row-major strides.',
              topicTag: 'Tensors & Autograd'
            },
            {
              id: 'q-d1-3',
              question: 'What is the performance implication of calling .item() inside a PyTorch training loop on CUDA?',
              options: [
                'It causes GPU memory fragmentation',
                'It forces a blocking synchronization between the GPU and CPU, stalling parallel execution',
                'It degrades gradient precision from float32 to float16',
                'It permanently clears the computational graph'
              ],
              correctAnswerIndex: 1,
              explanation: '.item() extracts a single scalar to the CPU host, forcing the CPU to wait for all asynchronous GPU kernels to finish executing.',
              topicTag: 'GPU Acceleration'
            },
            {
              id: 'q-d1-4',
              question: 'In PyTorch broadcasting rules, two dimensions are compatible if:',
              options: [
                'They are both even numbers',
                'They are equal, or one of them is equal to 1',
                'The sum of the dimensions equals a power of 2',
                'Both dimensions are greater than zero'
              ],
              correctAnswerIndex: 1,
              explanation: 'Under standard NumPy and PyTorch broadcasting rules, dimensions match if they are equal or if one of the dimensions is 1.',
              topicTag: 'Tensors & Autograd'
            },
            {
              id: 'q-d1-5',
              question: 'What does setting pin_memory=True in a PyTorch DataLoader accomplish?',
              options: [
                'It caches dataset samples directly on the GPU VRAM',
                'It allocates host memory in page-locked RAM, enabling faster asynchronous CUDA memory transfers',
                'It prevents memory leakage by turning off Python garbage collection',
                'It freezes model layer weights during backpropagation'
              ],
              correctAnswerIndex: 1,
              explanation: 'Pinned (page-locked) host memory allows the GPU to use Direct Memory Access (DMA) to copy tensors directly without CPU intervention.',
              topicTag: 'GPU Acceleration'
            }
          ]
        },
        {
          id: 'lesson-d2',
          dayNumber: 2,
          stageId: 'stage-1',
          stageName: 'Stage 1: Tensor Computation & Foundations',
          title: 'Day 2: Automatic Differentiation with torch.autograd',
          summary: 'Deconstruct the dynamic computational DAG (Directed Acyclic Graph), backward propagation, and gradient accumulation hooks.',
          estimatedMinutes: 65,
          isCompleted: true,
          completedAt: '2026-10-22T19:00:00Z',
          objectives: [
            'Trace how PyTorch builds dynamic computation graphs during the forward pass.',
            'Compute exact Jacobian-vector products using torch.autograd.grad and loss.backward().',
            'Prevent memory leaks by properly zeroing gradients and utilizing torch.no_grad().',
          ],
          contentMarkdown: `### 1. Dynamic Computation Graphs
Every time an operation is performed on a tensor with \`requires_grad=True\`, PyTorch generates an execution node represented by \`Node\` / \`grad_fn\`.

When \`loss.backward()\` is invoked, PyTorch traverses this DAG in reverse topological order, applying the chain rule of calculus to populate the \`.grad\` attribute of each leaf tensor.

\`\`\`python
import torch

w = torch.tensor([2.0, -1.0], requires_grad=True)
b = torch.tensor(1.5, requires_grad=True)
x = torch.tensor([3.0, 4.0])

# Forward pass
y = torch.dot(w, x) + b
# Backward pass
y.backward()

print(f"dy/dw: {w.grad}")  # Expected [3.0, 4.0]
print(f"dy/db: {b.grad}")  # Expected 1.0
\`\`\`

### 2. Gradient Accumulation Gotchas
Gradients in PyTorch accumulate by default (i.e. \`tensor.grad += new_grad\`). If you forget \`optimizer.zero_grad()\`, gradients from previous iterations will corrupt current weights.`,
          codeSnippet: {
            language: 'python',
            code: `import torch

# Proper zero-grad with memory optimization
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for inputs, targets in dataloader:
    # set_to_none=True yields modest speedups over writing zeros into memory
    optimizer.zero_grad(set_to_none=True)
    outputs = model(inputs)
    loss = criterion(outputs, targets)
    loss.backward()
    optimizer.step()`,
            description: 'Modern optimizer zero_grad idiom with set_to_none=True'
          },
          keyTakeaways: [
            'Leaf tensors are user-created tensors where requires_grad=True.',
            'optimizer.zero_grad(set_to_none=True) reduces memory write bandwidth compared to filling zeros.',
            'torch.no_grad() disables DAG construction, halving memory consumption during validation.'
          ],
          videoResource: {
            youtubeId: 'IHZwWFHWa-w',
            title: 'Gradient Descent & How Neural Networks Learn',
            channel: '3Blue1Brown',
            duration: '21 min',
            summary: 'Visual exploration of loss surfaces, gradient vectors, and the calculus of automatic differentiation.'
          },
          resources: [
            {
              id: 'res-d2-1',
              title: 'A Gentle Introduction to torch.autograd',
              url: 'https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html',
              type: 'documentation',
              duration: '20 min',
              isFree: true
            }
          ],
          tasks: [
            {
              id: 'task-d2-1',
              title: 'Implement Custom Polynomial Autograd Graph',
              description: 'Define f(x) = 3x^3 - 2x^2 + 5x - 7 and verify PyTorch autograd outputs match analytic derivative at x = 2.5.',
              instructions: [
                'Set x = torch.tensor(2.5, requires_grad=True)',
                'Compute y and call y.backward()',
                'Verify x.grad == (9*(2.5**2) - 4*(2.5) + 5)'
              ],
              completed: true
            }
          ],
          quizQuestions: [
            {
              id: 'q-d2-1',
              question: 'Why do gradients accumulate by default in PyTorch tensor .grad attributes?',
              options: [
                'Because of a legacy bug in C++ backend',
                'To naturally support gradient accumulation across multiple mini-batches when GPU memory is limited',
                'To automatically normalize learning rate across epochs',
                'Because tensors are immutable'
              ],
              correctAnswerIndex: 1,
              explanation: 'Accumulating gradients enables effective training with large batch sizes by executing multiple forward/backward steps before calling optimizer.step().',
              topicTag: 'Tensors & Autograd'
            },
            {
              id: 'q-d2-2',
              question: 'What is the primary advantage of optimizer.zero_grad(set_to_none=True) over standard zero_grad()?',
              options: [
                'It resets momentum buffers in Adam optimizer',
                'It deallocates the gradient tensor memory rather than writing zeros, reducing memory bus traffic',
                'It doubles floating point precision',
                'It automatically calculates batch statistics'
              ],
              correctAnswerIndex: 1,
              explanation: 'Setting gradient references to None frees the buffer instead of performing an explicit memory write of zeros, delivering measurable throughput gains.',
              topicTag: 'Tensors & Autograd'
            },
            {
              id: 'q-d2-3',
              question: 'Which context manager must be used during model evaluation to prevent storing intermediary activation maps?',
              options: [
                'torch.inference_mode() or torch.no_grad()',
                'torch.optimize()',
                'torch.compile()',
                'torch.autocast()'
              ],
              correctAnswerIndex: 0,
              explanation: 'torch.inference_mode() and torch.no_grad() deactivate autograd graph tracking, conserving memory and accelerating evaluation.',
              topicTag: 'Tensors & Autograd'
            },
            {
              id: 'q-d2-4',
              question: 'What happens if you invoke loss.backward() twice on the same computation graph without retain_graph=True?',
              options: [
                'The gradients are doubled automatically',
                'A RuntimeError occurs because intermediate computational buffers were freed after the first backward call',
                'The model weights revert to their initial values',
                'PyTorch silently ignores the second call'
              ],
              correctAnswerIndex: 1,
              explanation: 'By default, PyTorch frees intermediate buffers as soon as backward traversal finishes to conserve VRAM, raising an error if called again without retain_graph=True.',
              topicTag: 'Tensors & Autograd'
            },
            {
              id: 'q-d2-5',
              question: 'What is the result of calling tensor.detach()?',
              options: [
                'It deletes the tensor from GPU memory',
                'It returns a new tensor sharing the same data that is disconnected from the autograd graph',
                'It converts the tensor to a NumPy array',
                'It computes the inverse matrix'
              ],
              correctAnswerIndex: 1,
              explanation: 'tensor.detach() returns a view that shares storage with the original tensor but has requires_grad=False and no grad_fn.',
              topicTag: 'Tensors & Autograd'
            }
          ]
        },
        {
          id: 'lesson-d3',
          dayNumber: 3,
          stageId: 'stage-1',
          stageName: 'Stage 1: Tensor Computation & Foundations',
          title: 'Day 3: Custom Neural Layers & torch.nn Architecture',
          summary: 'Build robust modular deep learning components subclassing torch.nn.Module with Parameter registration and hook inspection.',
          estimatedMinutes: 60,
          isCompleted: false,
          objectives: [
            'Implement custom nn.Module classes with forward pass implementations.',
            'Register trainable parameters using torch.nn.Parameter and verify registration in model.parameters().',
            'Handle state dict serialization and deserialization for model checkpointing.',
          ],
          contentMarkdown: `### 1. Subclassing torch.nn.Module
Every deep learning layer or complete model in PyTorch inherits from \`torch.nn.Module\`.

Key responsibilities:
- In \`__init__\`, initialize superclass and define sub-modules and parameters.
- In \`forward(*inputs)\`, specify tensor math operations. Never call \`model.forward(x)\` directly in consumer code; invoke \`model(x)\` so PyTorch execution hooks fire.`,
          codeSnippet: {
            language: 'python',
            code: `import torch
import torch.nn as nn

class ResidualLinear(nn.Module):
    def __init__(self, dim, dropout_rate=0.1):
        super().__init__()
        self.linear = nn.Linear(dim, dim)
        self.norm = nn.LayerNorm(dim)
        self.dropout = nn.Dropout(dropout_rate)
        self.gelu = nn.GELU()

    def forward(self, x):
        residual = x
        out = self.gelu(self.linear(x))
        out = self.dropout(out)
        return self.norm(residual + out)`,
            description: 'Production-ready Residual Linear Block with LayerNorm'
          },
          keyTakeaways: [
            'Always call model(x) rather than model.forward(x) to ensure pre/post-forward hooks execute.',
            'nn.Parameter flags a tensor as a trainable weight automatically recognized by optimizers.',
            'model.train() and model.eval() toggle behaviors in stateful layers like Dropout and BatchNorm.'
          ],
          videoResource: {
            youtubeId: 'VMj-3S1tku0',
            title: 'What is a Neural Network? First Principles Architecture',
            channel: '3Blue1Brown',
            duration: '19 min',
            summary: 'Deconstruct multilayer perceptrons, matrix weight transformations, bias vectors, and activation non-linearities.'
          },
          resources: [
            {
              id: 'res-d3-1',
              title: 'Deep Dive into PyTorch nn.Module Design Patterns',
              url: 'https://pytorch.org/docs/stable/notes/modules.html',
              type: 'documentation',
              duration: '30 min',
              isFree: true
            }
          ],
          tasks: [
            {
              id: 'task-d3-1',
              title: 'Build a Multi-Layer Perceptron with Residual Connections',
              description: 'Create a 3-layer MLP that takes an input vector of dimension 64 and outputs 10 class logits with residual skip connections.',
              instructions: [
                'Subclass nn.Module',
                'Instantiate 3 nn.Linear modules with GELU activations',
                'In forward(), add skip connections where dimensions match',
                'Test output shape on a dummy torch.randn(8, 64) batch'
              ],
              completed: false
            }
          ],
          quizQuestions: [
            {
              id: 'q-d3-1',
              question: 'Why should you call model(inputs) instead of model.forward(inputs)?',
              options: [
                'model.forward is a deprecated syntax in PyTorch 2.0',
                'Calling the module directly invokes __call__, which registers and executes all hooks and autograd profiling logic',
                'model.forward runs strictly on the CPU',
                'It prevents gradient backpropagation'
              ],
              correctAnswerIndex: 1,
              explanation: 'nn.Module implements __call__, which wraps the forward method with pre-forward and post-forward hooks essential for distributed training, profiling, and activation caching.',
              topicTag: 'Neural Architecture'
            },
            {
              id: 'q-d3-2',
              question: 'What is the role of torch.nn.Parameter when assigned to an attribute of an nn.Module?',
              options: [
                'It sets the tensor as read-only constant',
                'It automatically registers the tensor in module.parameters() so optimizers can track and update it',
                'It forces the tensor to float64 precision',
                'It compresses the tensor using quantized integer formats'
              ],
              correctAnswerIndex: 1,
              explanation: 'nn.Parameter is a Tensor subclass that alerts nn.Module to include it in .parameters() and include it in saved state_dicts.',
              topicTag: 'Neural Architecture'
            },
            {
              id: 'q-d3-3',
              question: 'What is the difference between model.eval() and torch.no_grad()?',
              options: [
                'They perform the exact same task',
                'model.eval() alters behavior of layers like Dropout and BatchNorm, while torch.no_grad() disables autograd graph tracking',
                'torch.no_grad() changes layer parameters to zero',
                'model.eval() saves weights to local disk'
              ],
              correctAnswerIndex: 1,
              explanation: 'model.eval() switches layers into inference mode (Dropout deactivates, BatchNorm uses running stats), while torch.no_grad() is a context manager disabling backprop tracking.',
              topicTag: 'Neural Architecture'
            },
            {
              id: 'q-d3-4',
              question: 'How do you inspect all named trainable weights and their current tensor shapes in a model?',
              options: [
                'for name, param in model.named_parameters(): print(name, param.shape)',
                'model.print_all_weights()',
                'model.to_json()',
                'torch.inspect(model)'
              ],
              correctAnswerIndex: 0,
              explanation: 'model.named_parameters() iterates over all registered parameters with their hierarchical path names and tensor objects.',
              topicTag: 'Neural Architecture'
            },
            {
              id: 'q-d3-5',
              question: 'Which method should you use to register persistent non-trainable state (such as running means) in an nn.Module?',
              options: [
                'self.register_buffer(name, tensor)',
                'self.register_parameter(name, tensor)',
                'self.add_constant(tensor)',
                'self.store_static(tensor)'
              ],
              correctAnswerIndex: 0,
              explanation: 'Buffers registered with register_buffer are included in state_dict checkpoints and moved to GPU with model.to(device), but are not treated as trainable parameters.',
              topicTag: 'Neural Architecture'
            }
          ]
        },
        {
          id: 'lesson-d4',
          dayNumber: 4,
          stageId: 'stage-1',
          stageName: 'Stage 1: Tensor Computation & Foundations',
          title: 'Day 4: Loss Functions & Optimization Algorithms',
          summary: 'Examine cross-entropy mathematical formulation, label smoothing, learning rate schedules, and AdamW weight decay mechanics.',
          estimatedMinutes: 65,
          isCompleted: false,
          objectives: [
            'Derive why nn.CrossEntropyLoss expects raw logits rather than softmax probabilities.',
            'Distinguish L2 regularization from decoupled weight decay in AdamW.',
            'Configure Cosine Annealing learning rate warm-up schedules.',
          ],
          contentMarkdown: `### 1. Cross-Entropy Loss & Numerical Stability
PyTorch \`nn.CrossEntropyLoss\` fuses \`LogSoftmax\` and \`NLLLoss\` into a single optimized C++ kernel.
Never pass \`torch.softmax(logits)\` into \`nn.CrossEntropyLoss\`, as this results in double-softmax calculation and severe numerical instability with log-of-zero underflow!`,
          codeSnippet: {
            language: 'python',
            code: `import torch.nn as nn
from torch.optim.lr_scheduler import CosineAnnealingLR

criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)
scheduler = CosineAnnealingLR(optimizer, T_max=100, eta_min=1e-6)`,
            description: 'Stable training setup with AdamW, Label Smoothing and Cosine LR Scheduler'
          },
          keyTakeaways: [
            'Raw unnormalized logits must be passed directly into nn.CrossEntropyLoss.',
            'AdamW decouples weight decay from the gradient update, yielding better generalization than classic Adam with L2 penalty.',
            'Learning rate warmup stabilizes transformer training during early stochastic gradient steps.'
          ],
          resources: [
            {
              id: 'res-d4-1',
              title: 'Decoupled Weight Decay Regularization (Loshchilov & Hutter)',
              url: 'https://arxiv.org/abs/1711.05101',
              type: 'article',
              duration: '25 min',
              isFree: true
            }
          ],
          tasks: [
            {
              id: 'task-d4-1',
              title: 'Simulate Numerical Underflow in Naive LogSoftmax',
              description: 'Demonstrate why naive log(softmax(x)) produces NaN on large logits like x = [1000, 1001], whereas nn.CrossEntropyLoss uses the Log-Sum-Exp trick.',
              instructions: [
                'Create tensor x = torch.tensor([1000.0, 1001.0])',
                'Compute torch.log(torch.softmax(x, dim=0)) and note -inf/nan',
                'Compute torch.log_softmax(x, dim=0) and observe numerical stability'
              ],
              completed: false
            }
          ],
          quizQuestions: [
            {
              id: 'q-d4-1',
              question: 'Why does PyTorch nn.CrossEntropyLoss require unnormalized logits rather than probabilities from a softmax activation?',
              options: [
                'To verify that inputs are non-negative',
                'Because it combines LogSoftmax and NLLLoss using the Log-Sum-Exp trick to prevent numerical underflow and overflow',
                'Because softmax is too slow to compute',
                'To automatically normalize multi-label inputs'
              ],
              correctAnswerIndex: 1,
              explanation: 'Combining LogSoftmax and NLLLoss allows computing log(sum(exp(x_i))) in a numerically stable way via subtracting the max logit value.',
              topicTag: 'Loss & Optimization'
            },
            {
              id: 'q-d4-2',
              question: 'Why is AdamW preferred over standard Adam with L2 regularization when training deep models?',
              options: [
                'AdamW runs on TPU hardware only',
                'In adaptive optimizers like Adam, L2 regularization interacts incorrectly with gradient normalization, whereas AdamW applies weight decay directly to weights',
                'AdamW has zero hyperparameters',
                'AdamW avoids calculating gradients entirely'
              ],
              correctAnswerIndex: 1,
              explanation: 'Loshchilov and Hutter showed that in standard Adam, L2 regularization is scaled by 1/sqrt(v_t), which penalizes weights with large gradients less than weights with small gradients. AdamW fixes this decoupled decay.',
              topicTag: 'Loss & Optimization'
            },
            {
              id: 'q-d4-3',
              question: 'What does label smoothing achieve during multi-class classification training?',
              options: [
                'It rounds float targets to integer labels',
                'It prevents the model from becoming overconfident by softening the one-hot target distributions, improving generalization',
                'It automatically doubles the training data',
                'It removes corrupt labels from the dataset'
              ],
              correctAnswerIndex: 1,
              explanation: 'Label smoothing replaces hard 0 and 1 targets with (1-e) and e/K, preventing logits from growing infinitely large and curtailing model overconfidence.',
              topicTag: 'Loss & Optimization'
            },
            {
              id: 'q-d4-4',
              question: 'When using CosineAnnealingLR, what does the parameter T_max represent?',
              options: [
                'Maximum batch size',
                'The number of iterations or epochs until the learning rate reaches eta_min',
                'The maximum learning rate threshold',
                'The number of layers to freeze'
              ],
              correctAnswerIndex: 1,
              explanation: 'T_max represents the maximum number of iterations or epochs before the cosine curve reaches its minimum value (eta_min).',
              topicTag: 'Loss & Optimization'
            },
            {
              id: 'q-d4-5',
              question: 'What is the purpose of gradient clipping (torch.nn.utils.clip_grad_norm_)?',
              options: [
                'To discard weights below a certain magnitude',
                'To prevent exploding gradients from destabilizing weight updates during backpropagation',
                'To speed up GPU memory transfers',
                'To enforce sparse weight matrices'
              ],
              correctAnswerIndex: 1,
              explanation: 'clip_grad_norm_ rescales parameter gradients if their total L2 norm exceeds a specified threshold, keeping optimizer updates stable.',
              topicTag: 'Loss & Optimization'
            }
          ]
        },
        {
          id: 'lesson-d5',
          dayNumber: 5,
          stageId: 'stage-1',
          stageName: 'Stage 1: Tensor Computation & Foundations',
          title: 'Day 5: Attention Mechanisms & Scaled Dot-Product Math',
          summary: 'Dissect Query, Key, Value vector projections, matrix dot-product attention scaling factor, and causal masking matrices.',
          estimatedMinutes: 70,
          isCompleted: false,
          objectives: [
            'Formulate the mathematical equation of Scaled Dot-Product Attention: Softmax(QK^T / sqrt(d_k)) V.',
            'Explain why the scaling factor 1/sqrt(d_k) prevents vanishing gradients in softmax.',
            'Implement causal (autoregressive) triangular masking for decoder architectures.',
          ],
          contentMarkdown: `### 1. Scaled Dot-Product Attention
Attention allows a token representation to dynamically gather information from all other tokens in a sequence:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$$

### 2. Why Divide by $\\sqrt{d_k}$?
When $d_k$ is large, the dot products grow large in magnitude, pushing the softmax function into regions with extremely tiny gradients (saturation). Scaling by $1/\\sqrt{d_k}$ preserves unit variance.`,
          codeSnippet: {
            language: 'python',
            code: `import torch
import math

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    weights = torch.softmax(scores, dim=-1)
    return torch.matmul(weights, V), weights`,
            description: 'Minimal pure-PyTorch Scaled Dot-Product Attention'
          },
          keyTakeaways: [
            'Q, K, V represent Query (what I search for), Key (what I offer), and Value (content).',
            'Dividing by sqrt(d_k) keeps variance at 1, avoiding softmax gradient saturation.',
            'Causal masking fills upper-triangular future token positions with -infinity.'
          ],
          resources: [
            {
              id: 'res-d5-1',
              title: 'Attention Is All You Need (Vaswani et al.)',
              url: 'https://arxiv.org/abs/1706.03762',
              type: 'article',
              duration: '35 min',
              isFree: true
            }
          ],
          tasks: [
            {
              id: 'task-d5-1',
              title: 'Implement Causal Mask from Scratch',
              description: 'Create a torch.triu mask of shape (SeqLen, SeqLen) and confirm future tokens receive 0 attention weight after softmax.',
              instructions: [
                'Construct mask using torch.tril(torch.ones(SeqLen, SeqLen))',
                'Apply masked_fill with float("-inf")',
                'Verify row sums of softmax weights equal 1.0'
              ],
              completed: false
            }
          ],
          quizQuestions: [
            {
              id: 'q-d5-1',
              question: 'Why is the dot-product QK^T divided by sqrt(d_k) in scaled dot-product attention?',
              options: [
                'To convert complex numbers into real values',
                'Because for large d_k, dot products grow large in magnitude, driving softmax into regions with vanishingly small gradients',
                'To reduce memory bandwidth on GPU tensor cores',
                'To ensure the matrix is symmetric'
              ],
              correctAnswerIndex: 1,
              explanation: 'Without scaling by sqrt(d_k), large embedding dimensions cause dot products to blow up, yielding peaky softmax distributions with virtually zero gradients.',
              topicTag: 'Attention & Transformers'
            },
            {
              id: 'q-d5-2',
              question: 'In autoregressive causal language modeling (like GPT), why is a causal mask applied to attention scores before softmax?',
              options: [
                'To hide padding tokens at the beginning of the sequence',
                'To prevent tokens from attending to subsequent future positions during generation and training',
                'To compress sequence length',
                'To speed up layer normalization'
              ],
              correctAnswerIndex: 1,
              explanation: 'Causal masking sets attention scores of future token positions to -infinity so their softmax probability becomes 0, preserving the autoregressive property.',
              topicTag: 'Attention & Transformers'
            },
            {
              id: 'q-d5-3',
              question: 'What is the computational complexity of standard self-attention with respect to sequence length N?',
              options: [
                'O(N)',
                'O(N * log N)',
                'O(N^2)',
                'O(N^3)'
              ],
              correctAnswerIndex: 2,
              explanation: 'Computing the QK^T matrix product requires calculating dot products between all N queries and N keys, resulting in O(N^2) quadratic complexity.',
              topicTag: 'Attention & Transformers'
            },
            {
              id: 'q-d5-4',
              question: 'What is the relationship between the shapes of Q, K, and V in self-attention?',
              options: [
                'Q and K must have the same dimension d_k; V can have a distinct dimension d_v',
                'All three must have identical batch, sequence, and feature dimensions',
                'Q must be larger than K and V',
                'V must be square'
              ],
              correctAnswerIndex: 0,
              explanation: 'While Q and K must share dimension d_k to allow matrix multiplication QK^T, the value matrix V can technically have a distinct dimension d_v, though in standard transformers d_k == d_v.',
              topicTag: 'Attention & Transformers'
            },
            {
              id: 'q-d5-5',
              question: 'What is the benefit of Multi-Head Attention over Single-Head Attention?',
              options: [
                'It reduces total model parameter count by half',
                'It allows the model to jointly attend to information from different representation subspaces at different positions',
                'It guarantees 100% training accuracy',
                'It removes the need for positional encodings'
              ],
              correctAnswerIndex: 1,
              explanation: 'Splitting into multiple attention heads projects queries, keys, and values into multiple subspaces, allowing the model to focus on syntactic, semantic, and positional relationships simultaneously.',
              topicTag: 'Attention & Transformers'
            }
          ]
        },
        {
          id: 'lesson-d6',
          dayNumber: 6,
          stageId: 'stage-1',
          stageName: 'Stage 1: Tensor Computation & Foundations',
          title: 'Day 6: Multi-Head Attention & Transformer Encoders',
          summary: 'Assemble full Multi-Head Attention blocks with linear projections, feed-forward sublayers, pre-LayerNorm, and residual connections.',
          estimatedMinutes: 70,
          isCompleted: false,
          objectives: [
            'Assemble multi-head tensor splitting and recombination using torch.view and torch.transpose.',
            'Contrast Pre-LayerNorm vs Post-LayerNorm stability for deep transformer training.',
            'Implement Position-wise Feed-Forward Networks (FFN) with SwiGLU / GELU activations.',
          ],
          contentMarkdown: `### 1. Pre-LN vs Post-LN Architecture
Modern LLMs (Llama, Gemma, GPT-3) almost exclusively adopt **Pre-LN** (or Pre-RMSNorm):
\`\`\`
x = x + SelfAttention(Norm(x))
x = x + FFN(Norm(x))
\`\`\`
In contrast to original Post-LN transformers, Pre-LN allows uninterrupted identity gradients through the residual stream, preventing gradient vanishing or explosion without fragile warmups.`,
          codeSnippet: {
            language: 'python',
            code: `import torch.nn as nn

class TransformerBlock(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        self.norm1 = nn.LayerNorm(d_model)
        self.attn = nn.MultiheadAttention(d_model, num_heads, dropout=dropout, batch_first=True)
        self.norm2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model)
        )

    def forward(self, x):
        # Pre-LN architecture
        normed_x = self.norm1(x)
        attn_out, _ = self.attn(normed_x, normed_x, normed_x)
        x = x + attn_out
        x = x + self.ffn(self.norm2(x))
        return x`,
            description: 'Modern Pre-LayerNorm Transformer Encoder Block'
          },
          keyTakeaways: [
            'Pre-LN architecture stabilizes backpropagation and prevents exploding gradients in deep stacks.',
            'Batch-first=True avoids repetitive tensor transpose operations between (SeqLen, Batch, Dim) and (Batch, SeqLen, Dim).',
            'FFN expansion factor is typically 4x (e.g. d_model=768, d_ff=3072).'
          ],
          resources: [
            {
              id: 'res-d6-1',
              title: 'The Illustrated Transformer by Jay Alammar',
              url: 'https://jalammar.github.io/illustrated-transformer/',
              type: 'article',
              duration: '35 min',
              isFree: true
            }
          ],
          tasks: [
            {
              id: 'task-d6-1',
              title: 'Build a Complete 4-Layer Pre-LN Transformer Stack',
              description: 'Chain 4 TransformerBlocks and run a batch of size 4 with sequence length 32 to verify tensor shape stability.',
              instructions: [
                'Set d_model=256, num_heads=4, d_ff=1024',
                'Pass input tensor of shape (4, 32, 256)',
                'Assert output shape strictly matches (4, 32, 256)'
              ],
              completed: false
            }
          ],
          quizQuestions: [
            {
              id: 'q-d6-1',
              question: 'Why is Pre-LayerNorm widely preferred over Post-LayerNorm in contemporary large language models?',
              options: [
                'It eliminates matrix multiplication entirely',
                'It keeps an unimpeded residual highway, ensuring stable gradient flow without fragile learning rate warmup schemes',
                'It decreases memory consumption by 90%',
                'It allows models to train without backpropagation'
              ],
              correctAnswerIndex: 1,
              explanation: 'Pre-LN maintains an unnormalized skip path, allowing gradients to propagate directly through identity connections without decay.',
              topicTag: 'Attention & Transformers'
            },
            {
              id: 'q-d6-2',
              question: 'In a transformer MultiheadAttention layer with d_model=512 and num_heads=8, what is the head dimension d_k?',
              options: [
                '8',
                '64',
                '128',
                '512'
              ],
              correctAnswerIndex: 1,
              explanation: 'd_k = d_model / num_heads = 512 / 8 = 64.',
              topicTag: 'Attention & Transformers'
            },
            {
              id: 'q-d6-3',
              question: 'What is the purpose of positional encodings in transformer models?',
              options: [
                'To count the number of tokens in the prompt',
                'To inject sequence order information, because self-attention is permutation-invariant',
                'To normalize token frequencies',
                'To prevent zero-division errors'
              ],
              correctAnswerIndex: 1,
              explanation: 'Because attention calculates pairwise relations independent of token position, positional encodings are required to signal token ordering.',
              topicTag: 'Attention & Transformers'
            },
            {
              id: 'q-d6-4',
              question: 'What is RMSNorm (Root Mean Square Normalization) and why is it used in models like Llama?',
              options: [
                'It normalizes weights before every batch',
                'It is a simplified LayerNorm that skips mean-centering, saving 10-20% computational overhead with comparable performance',
                'It normalizes learning rate schedules',
                'It is an alternative to cross-entropy loss'
              ],
              correctAnswerIndex: 1,
              explanation: 'RMSNorm regularizes the inputs using root mean square without subtracting the mean, yielding faster execution without loss of model capacity.',
              topicTag: 'Neural Architecture'
            },
            {
              id: 'q-d6-5',
              question: 'What is the typical hidden dimension ratio in the position-wise Feed-Forward Network (FFN)?',
              options: [
                '1/2 of d_model',
                'Equal to d_model',
                '4x d_model (or ~8/3x with SwiGLU)',
                '16x d_model'
              ],
              correctAnswerIndex: 2,
              explanation: 'Standard transformers use an expansion factor of 4x (e.g. 768 to 3072), while GLU variants typically use 8/3 to maintain parameter equivalence.',
              topicTag: 'Attention & Transformers'
            }
          ]
        },
        {
          id: 'lesson-d7',
          dayNumber: 7,
          stageId: 'stage-1',
          stageName: 'Stage 1: Tensor Computation & Foundations',
          title: 'Day 7: Stage 1 Synthesis & Weekly Assessment Milestone',
          summary: 'Synthesize Stage 1 foundations across Tensors, Autograd, Custom Modules, Loss Functions, and Transformers. Take the Week 1 Cumulative Assessment.',
          estimatedMinutes: 75,
          isCompleted: false,
          objectives: [
            'Review end-to-end tensor flow from raw input through autograd to multi-head attention.',
            'Audit common architectural bugs and numerical failure modes in deep learning.',
            'Complete the 10-Question Week 1 Cumulative Assessment with >= 70% passing threshold.',
          ],
          contentMarkdown: `### Week 1 Milestone: The Foundations of Modern AI
Congratulations on completing the first 7-day cycle! You have traversed:
- **Tensors & Strides**: Internal memory models and GPU pin_memory acceleration.
- **Autograd Mechanics**: Dynamic graphs, Jacobian products, zero-grad optimization.
- **Modular PyTorch**: \`nn.Module\`, \`nn.Parameter\`, state dicts, and hook pipelines.
- **Loss & Optimization**: Cross-entropy numerics, label smoothing, AdamW decoupled decay.
- **Transformers & Attention**: Scaled dot-product math, causal masking, Pre-LN vs Post-LN.

Take the **10-question cumulative assessment** below to validate your mastery. A passing score of **70% (7/10 questions)** is required to verify baseline readiness for Stage 2.`,
          keyTakeaways: [
            'Stage 1 establishes the mathematical bedrock for Stage 2 LLM Fine-Tuning & Vector Search.',
            'Passing threshold is 70% (7/10 correct). Scores below 70% automatically unlock targeted Adaptive Revision.',
            'You can proceed with subsequent lessons regardless of assessment outcome.'
          ],
          resources: [
            {
              id: 'res-d7-1',
              title: 'Comprehensive PyTorch Developer Reference Handbook',
              url: 'https://pytorch.org/docs/stable/index.html',
              type: 'documentation',
              duration: '45 min',
              isFree: true
            }
          ],
          tasks: [
            {
              id: 'task-d7-1',
              title: 'Complete Week 1 Cumulative Assessment',
              description: 'Engage with the 10-question evaluation covering all Week 1 core competencies.',
              instructions: [
                'Review your notes from Days 1 through 6',
                'Launch the Weekly Assessment modal',
                'Review your topic-wise mastery report'
              ],
              completed: false
            }
          ],
          quizQuestions: [
            {
              id: 'q-d7-1',
              question: 'Which operation converts a non-contiguous tensor into contiguous memory?',
              options: ['tensor.contiguous()', 'tensor.clone()', 'tensor.squeeze()', 'tensor.detach()'],
              correctAnswerIndex: 0,
              explanation: 'tensor.contiguous() returns a contiguous in-memory tensor copying data if needed.',
              topicTag: 'Tensors & Autograd'
            },
            {
              id: 'q-d7-2',
              question: 'What is the required minimum passing score on a 5-question daily quiz under the 70% rule?',
              options: ['3 correct answers', '4 correct answers (ceil(3.5))', '5 correct answers', '2 correct answers'],
              correctAnswerIndex: 1,
              explanation: 'The passing threshold is 70%, rounded up to a whole question. For 5 questions, ceil(5 * 0.70) = 4 correct answers.',
              topicTag: 'General AI'
            },
            {
              id: 'q-d7-3',
              question: 'Why does AdamW decouple weight decay from the gradient step?',
              options: ['To allow GPU parallelization', 'To fix the flaw where L2 regularization in Adam is disproportionately small for large gradients', 'To decrease tensor rank', 'To prevent CPU overheating'],
              correctAnswerIndex: 1,
              explanation: 'AdamW separates weight decay from adaptive moment scaling, resulting in proper L2-style regularization for adaptive optimizers.',
              topicTag: 'Loss & Optimization'
            },
            {
              id: 'q-d7-4',
              question: 'What is the purpose of dividing QK^T by sqrt(d_k)?',
              options: ['To invert matrix determinant', 'To prevent softmax saturation and vanishing gradients in high dimensions', 'To quantize to 8-bit integers', 'To apply dropout'],
              correctAnswerIndex: 1,
              explanation: 'As d_k grows, dot products increase in variance; scaling keeps variance around 1 so softmax gradients remain healthy.',
              topicTag: 'Attention & Transformers'
            },
            {
              id: 'q-d7-5',
              question: 'In Pre-LayerNorm transformers, where is the layer normalization applied?',
              options: ['Directly after the residual addition', 'Before the multi-head attention and before the feed-forward network', 'Only on the final linear projection', 'Inside the softmax function'],
              correctAnswerIndex: 1,
              explanation: 'Pre-LN normalizes the inputs before passing them into the attention or FFN sub-layers, leaving the residual connection uninterrupted.',
              topicTag: 'Attention & Transformers'
            }
          ]
        }
      ]
    },
    {
      id: 'stage-2',
      stageNumber: 2,
      title: 'Stage 2: LLM Architecture, Parameter-Efficient Tuning & Quantization',
      description: 'Master LoRA/QLoRA fine-tuning, Rotary Positional Embeddings (RoPE), FlashAttention, and tokenizers.',
      estimatedWeeks: 2,
      topics: ['Rotary Embeddings (RoPE)', 'FlashAttention-2', 'Tokenization (BPE/WordPiece)', 'LoRA & QLoRA Fine-Tuning', 'Inference Optimization (vLLM)'],
      capstoneProject: {
        title: 'QLoRA Domain-Adapted LLM with vLLM Serving',
        description: 'Fine-tune an open-source 7B foundation model on specialized medical/legal corpus using 4-bit NormalFloat quantization and benchmark inference latency.',
        deliverables: ['Custom synthetic dataset generation pipeline', 'HuggingFace PEFT fine-tuning script', 'vLLM OpenAI-compatible endpoint'],
      },
      lessons: [
        {
          id: 'lesson-d8',
          dayNumber: 8,
          stageId: 'stage-2',
          stageName: 'Stage 2: LLM Architecture & Fine-Tuning',
          title: 'Day 8: Byte-Pair Encoding (BPE) & SentencePiece Tokenization',
          summary: 'Examine subword tokenization algorithms, vocabulary building, merge tables, special tokens, and token out-of-vocabulary handling.',
          estimatedMinutes: 60,
          objectives: ['Implement BPE merge algorithm from scratch.', 'Manage special tokens (BOS, EOS, PAD, UNK).', 'Audit token boundary and space-handling artifacts.'],
          contentMarkdown: '### BPE Fundamentals\nBPE iteratively merges the most frequent pairs of adjacent bytes or characters...',
          keyTakeaways: ['Subword tokenizers solve the OOV (Out of Vocabulary) challenge gracefully.', 'Vocabulary size represents a trade-off between sequence length and embedding table memory.'],
          resources: [{ id: 'res-d8-1', title: 'HuggingFace Tokenizers Deep Dive', url: 'https://huggingface.co/docs/tokenizers', type: 'documentation', duration: '20 min', isFree: true }],
          tasks: [{ id: 'task-d8-1', title: 'Train BPE on Tiny Corpus', description: 'Train a 500-token BPE tokenizer using HuggingFace Tokenizers library.', instructions: ['Initialize ByteLevelBPETokenizer', 'Train on text sample'], completed: false }],
          quizQuestions: [
            { id: 'q-d8-1', question: 'What problem does subword tokenization resolve?', options: ['GPU thermal throttling', 'The Out-Of-Vocabulary (OOV) challenge and explosion of vocabulary size', 'Sequence length limit', 'LayerNorm drift'], correctAnswerIndex: 1, explanation: 'Subword tokenization balances character-level granularity and whole-word efficiency, preventing OOV errors while keeping vocabulary manageable.', topicTag: 'Tokenization' },
            { id: 'q-d8-2', question: 'How does Byte-Pair Encoding (BPE) determine which token pair to merge next?', options: ['Random sampling', 'The pair with highest frequency in the training corpus', 'Alphabetical sorting', 'The shortest token pair'], correctAnswerIndex: 1, explanation: 'BPE iteratively counts adjacent symbol pairs and merges the single pair with highest occurrence count.', topicTag: 'Tokenization' },
            { id: 'q-d8-3', question: 'What is the role of the [UNK] token?', options: ['Signals End-Of-Sequence', 'Represents unknown characters not present in tokenizer vocabulary', 'Resets gradient buffers', 'Adds padding'], correctAnswerIndex: 1, explanation: '[UNK] is reserved to represent characters or sequences that cannot be parsed by the tokenizer vocabulary.', topicTag: 'Tokenization' },
            { id: 'q-d8-4', question: 'Why does byte-level BPE (as in GPT-2 and Llama) virtually eliminate [UNK] tokens?', options: ['Because byte level can represent any arbitrary byte in UTF-8 encoding (256 base bytes)', 'Because it uses dictionary lookup', 'Because it only accepts English characters', 'Because it compresses words'], correctAnswerIndex: 0, explanation: 'By initializing vocabulary with the 256 individual bytes of the byte spectrum, any string in any language can be represented as byte sequences.', topicTag: 'Tokenization' },
            { id: 'q-d8-5', question: 'Why is padding token attention masking crucial when batching sequences of variable lengths?', options: ['To speed up compilation', 'To prevent padding tokens from influencing the self-attention weights of actual prompt tokens', 'To save disk space', 'To convert float16 to float32'], correctAnswerIndex: 1, explanation: 'An attention mask of 0 on pad positions guarantees that padding tokens contribute zero attention weight to actual content tokens.', topicTag: 'Tokenization' }
          ]
        }
      ]
    },
    {
      id: 'stage-3',
      stageNumber: 3,
      title: 'Stage 3: Retrieval-Augmented Generation (RAG) & Vector Databases',
      description: 'Design enterprise RAG architectures with hybrid vector search, cross-encoder reranking, and chunking strategies.',
      estimatedWeeks: 2,
      topics: ['Dense vs Sparse Embeddings', 'HNSW & Hierarchical Vector Indexing', 'Context Chunking & Metadata Filtering', 'Cross-Encoder Re-Ranking', 'RAG Evaluation (Ragas/ARES)'],
      lessons: []
    },
    {
      id: 'stage-4',
      stageNumber: 4,
      title: 'Stage 4: Autonomous AI Agents & Production Deployment',
      description: 'Implement multi-agent workflows with tool-calling, memory buffers, evaluation harnesses, and secure API gateways.',
      estimatedWeeks: 2,
      topics: ['Function Calling & Tool Use', 'ReAct & Plan-and-Solve Reasoning', 'LangGraph & Multi-Agent State', 'Guardrails & Prompt Injection Defense', 'Latency Optimization & Caching'],
      lessons: []
    }
  ]
};

// 10-Question Comprehensive Week 1 Cumulative Assessment
export const WEEK_1_ASSESSMENT_QUESTIONS = [
  {
    id: 'w1-q1',
    question: 'Why does calling .view() on a non-contiguous tensor raise a RuntimeError in PyTorch?',
    options: [
      'Because view() requires an active CUDA device context',
      'Because view() operates on adjacent in-memory bytes and requires standard row-major strides',
      'Because view() converts tensors to float64 automatically',
      'Because view() only accepts rank-1 vectors'
    ],
    correctAnswerIndex: 1,
    explanation: 'view() maps sequential memory addresses into new dimensions without data copying; if strides deviate from row-major order, contiguous() or reshape() must be invoked.',
    topicTag: 'Tensors & Strides'
  },
  {
    id: 'w1-q2',
    question: 'What is the performance advantage of setting pin_memory=True in a DataLoader?',
    options: [
      'It loads the entire dataset into GPU VRAM at startup',
      'It page-locks host RAM so the GPU DMA controller can transfer batches asynchronously without CPU buffering',
      'It compresses images on the fly',
      'It prevents out-of-order execution'
    ],
    correctAnswerIndex: 1,
    explanation: 'Pinned memory bypasses OS paging, enabling high-speed Direct Memory Access (DMA) directly into GPU VRAM.',
    topicTag: 'GPU Acceleration'
  },
  {
    id: 'w1-q3',
    question: 'Why do PyTorch gradients accumulate by default in tensor.grad rather than overwriting?',
    options: [
      'To allow seamless gradient accumulation across multiple micro-batches when VRAM is constrained',
      'Because tensors in Python are immutable',
      'To prevent race conditions on multi-threaded CPUs',
      'It is an unintended legacy behavior'
    ],
    correctAnswerIndex: 0,
    explanation: 'Default accumulation allows simulating large batch sizes by accumulating gradients over N micro-batches before executing optimizer.step().',
    topicTag: 'Autograd Dynamics'
  },
  {
    id: 'w1-q4',
    question: 'What is the critical difference between model.eval() and torch.no_grad()?',
    options: [
      'They are interchangeable aliases',
      'model.eval() alters layer state (Dropout turned off, BatchNorm uses running stats), while torch.no_grad() disables dynamic graph construction',
      'torch.no_grad() zeroes model weights',
      'model.eval() enables gradient computation'
    ],
    correctAnswerIndex: 1,
    explanation: 'model.eval() configures module operational modes, while torch.no_grad() is a context manager saving memory by halting computation graph recording.',
    topicTag: 'Neural Architecture'
  },
  {
    id: 'w1-q5',
    question: 'Why must raw logits be passed into nn.CrossEntropyLoss rather than softmax probabilities?',
    options: [
      'Because probabilities are incompatible with CUDA tensors',
      'Because nn.CrossEntropyLoss integrates LogSoftmax and NLLLoss using Log-Sum-Exp for numeric stability',
      'Because softmax produces negative values',
      'To double computational precision'
    ],
    correctAnswerIndex: 1,
    explanation: 'The Log-Sum-Exp trick prevents numerical underflow and overflow that occurs when taking the logarithm of small float32 probabilities.',
    topicTag: 'Loss & Optimization'
  },
  {
    id: 'w1-q6',
    question: 'How does AdamW resolve the flaw in standard Adam with L2 regularization?',
    options: [
      'By removing the beta1 momentum parameter',
      'By applying weight decay directly to model parameters independent of the adaptive gradient scale',
      'By using second-order Hessian matrices',
      'By disabling gradient clipping'
    ],
    correctAnswerIndex: 1,
    explanation: 'In standard Adam, L2 regularization is scaled by the inverse moving average of squared gradients; AdamW decouples this decay from gradient updates.',
    topicTag: 'Loss & Optimization'
  },
  {
    id: 'w1-q7',
    question: 'Why is the scaled dot-product attention score divided by sqrt(d_k)?',
    options: [
      'To normalize sequence length',
      'To counter large dot-product magnitudes that push softmax activations into vanishing gradient plateaus',
      'To ensure the attention matrix is orthogonal',
      'To convert attention scores into distances'
    ],
    correctAnswerIndex: 1,
    explanation: 'For large d_k, the dot products grow in magnitude, driving the softmax function into regions where the gradient is vanishingly small.',
    topicTag: 'Attention & Transformers'
  },
  {
    id: 'w1-q8',
    question: 'In an autoregressive decoder, what value is placed in the causal attention mask for future token positions?',
    options: ['0.0', '-1.0', '-infinity (or -1e9)', '1.0'],
    correctAnswerIndex: 2,
    explanation: 'Setting future scores to -infinity ensures that after the softmax exp(x) transformation, their attention probability is strictly 0.0.',
    topicTag: 'Attention & Transformers'
  },
  {
    id: 'w1-q9',
    question: 'Why is Pre-LayerNorm architecture superior for training deep transformer models compared to Post-LayerNorm?',
    options: [
      'It uses fewer floating-point parameters',
      'It preserves an unhindered identity residual path, allowing gradients to flow back directly through arbitrary depth',
      'It removes the need for feed-forward networks',
      'It enables 8-bit quantization during training'
    ],
    correctAnswerIndex: 1,
    explanation: 'Pre-LN maintains identity shortcuts throughout the model stack, eliminating vanishing gradients without delicate learning rate warmups.',
    topicTag: 'Attention & Transformers'
  },
  {
    id: 'w1-q10',
    question: 'Under RoadmapAI scoring rules, what is the minimum required number of correct answers to pass a 10-question assessment?',
    options: ['6 correct answers', '7 correct answers (ceil(10 * 0.70))', '8 correct answers', '5 correct answers'],
    correctAnswerIndex: 1,
    explanation: 'The passing threshold is 70% rounded up to a whole question: ceil(10 * 0.70) = 7 correct answers.',
    topicTag: 'Platform & Scoring'
  }
];

export const SAMPLE_WEAK_TOPIC_REVISION: WeakTopicItem = {
  id: 'weak-rev-attention',
  topic: 'Attention & Transformers',
  sourceType: 'quiz',
  sourceDayOrWeek: 5,
  detectedAt: '2026-10-25T14:30:00Z',
  simplifiedExplanation: 'Think of Attention like a search engine: the Query is your search term, the Key is the title/tag of every document in the library, and the Value is the actual page content. The search engine calculates how well your Query matches each Key, scales the relevance, and creates a weighted blend of all matching Values.',
  analogy: 'Imagine a spotlight in a theatre. Instead of lighting up every actor equally, the spotlight shifts its focus dynamically to whichever character is speaking or reacting to the scene.',
  practiceExercise: {
    prompt: 'You have a sequence of 3 tokens. Token 1 has queries that match Key 2 with score 10 and Key 3 with score 0. What proportion of the final blended output comes from Value 2 versus Value 3?',
    hint: 'Apply the softmax function: exp(10) / (exp(10) + exp(0)). Since exp(10) is ~22,026 and exp(0) is 1, what is the resulting percentage?',
    solution: 'Value 2 receives >99.99% of the attention weight, while Value 3 receives <0.01%. This demonstrates how sharp softmax distributions focus almost entirely on the highest matching key.'
  },
  drillQuestions: [
    {
      id: 'drill-q1',
      question: 'If you double the head dimension d_k from 64 to 256, what happens to the scaling factor 1/sqrt(d_k)?',
      options: ['It doubles from 1/8 to 1/4', 'It halves from 1/8 to 1/16', 'It remains 1/8', 'It quadruples'],
      correctAnswerIndex: 1,
      explanation: 'sqrt(64) = 8 (factor 1/8); sqrt(256) = 16 (factor 1/16). As d_k quadruples, the scaling factor halves.',
      topicTag: 'Attention & Transformers'
    },
    {
      id: 'drill-q2',
      question: 'Which component in Scaled Dot-Product Attention prevents tokens from seeing future words in text generation?',
      options: ['Layer Normalization', 'The Causal Triangular Mask', 'Dropout', 'Positional Encoding'],
      correctAnswerIndex: 1,
      explanation: 'The causal triangular mask sets future attention logits to -inf, guaranteeing future tokens receive zero probability.',
      topicTag: 'Attention & Transformers'
    },
    {
      id: 'drill-q3',
      question: 'Why does self-attention have quadratic O(N^2) time complexity with sequence length N?',
      options: ['Because each of the N tokens must compute an attention score against all N tokens in the sequence', 'Because it uses two GPUs simultaneously', 'Because of matrix inversion', 'Because of the feed-forward network'],
      correctAnswerIndex: 0,
      explanation: 'Every token queries every other token in the sequence, producing an N x N attention matrix requiring N^2 operations.',
      topicTag: 'Attention & Transformers'
    }
  ],
  mastered: false
};
