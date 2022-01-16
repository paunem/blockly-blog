# blockly-blog
 Google's block based editor https://github.com/google/blockly with an added C# ASP.NET Core 3.1 code generator. This generator generates code necessary to run different neural network models on an ASP.NET Core blog website from https://github.com/madskristensen/Miniblog.Core.
 
 Models that could be run with generated code in the Blockly editor:
 * OpenAI's GPT-2 (Generative Pre-trained Transformer 2) Medium language model https://huggingface.co/docs/transformers/model_doc/gpt2
 * Google's T5 (Text-To-Text Transfer Transformer) model https://huggingface.co/docs/transformers/model_doc/t5
 * OpenAI's DALL·E https://github.com/openai/DALL-E https://github.com/lucidrains/DALLE-pytorch
 * Google's ViT (Vision Transformer) https://huggingface.co/docs/transformers/model_doc/vit

The generator is located in tests\playgrounds\dotnet_generator.js
