Blockly.defineBlocksWithJsonArray([{
  "type": "dalle",
  "message0": "Text to image generator DALLE %1 Path to model script %2 %3 Model name %4 %5",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "path",
      "text": "path"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "name",
      "text": "name"
    },
    {
      "type": "input_dummy"
    }
    
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 120,
  "tooltip": "Trained on cc12m dataset\n Hyperparameters:\nEPOCHS = 1\nBATCH_SIZE = 40\nLEARNING_RATE = 4.5e-4\nIMAGE_DIMENSIONS = 756\nLAYERS = 64\nHEADS = 8\nHEAD_DIMENSIONS = 64"
},
{
  "type": "gpt_2",
  "message0": "Text generator GPT-2 %1 Path to model script %2 %3 Model name %4 %5",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "path",
      "text": "path"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "name",
      "text": "name"
    },
    {
      "type": "input_dummy"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 240,
  "tooltip": "Medium version with 345M parameters\nTrained on book texts\nHyperparameters:\nEPOCHS = 1000\nBATCH_SIZE = 1\nLEARNING_RATE = 2e-5\nLAYERS = 24"
},
{
  "type": "t5",
  "message0": "Text proccessing model T5 %1 Path to summarize script %2 %3 Path to translate script %4 %5",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "path_summarize",
      "text": "path"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "path_translate",
      "text": "path"
    },
    {
      "type": "input_dummy"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 60,
  "tooltip": "Small version with 60M parameters\nTrained on C4 dataset\nHyperparameters:\nLAYERS = 6\nHEADS = 8"
},
{
  "type": "vit",
  "message0": "Image interpretation model ViT %1 Path to model script %2 %3",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "path",
      "text": "path"
    },
    {
      "type": "input_dummy"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 180,
  "tooltip": "Base version with 86M parameters\nTrained on ImageNet dataset\nHyperparameters:\nLAYERS = 12\nHEADS = 12\nMLP SIZE = 3072"
},
{
  "type": "blog",
  "message0": "Blog base %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "models"
    }
  ],
  "inputsInline": false,
  "colour": 0,
  "tooltip": "Container for models"
}]);

var codelabToolbox = `
<xml id="toolbox" style="display: none">
<block type="blog"/>
<block type="gpt_2"/>
<block type="dalle"/>
<block type="t5"/>
<block type="vit"/>
</xml>
`;

const codelabGenerator = new Blockly.Generator('DOTNET');
//codelabGenerator.PRECEDENCE = 0;

/*
codelabGenerator['blog'] = function(block) {
  var code = `[Route("/blog/edit/{id?}/generatecontent")]`;
  var textFile = null;
  var data = new Blob([code], {type: 'text/plain; charset=utf-8'});
  //alert(data);
  var filename = "Post.cs";
  //saveAs(data, filename);

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);
    //window.location.assign(textFile);

    // returns a URL you can use as a href
    return textFile;
};*/

codelabGenerator['blog'] = function(block) {
  /*this.setDeletable(false);
  this.setMovable(false);
  this.setEditable(false);*/

  var output = '';
  var child_block = block.getChildren()[0];
  output += codelabGenerator.blockToCode(child_block);

  while(child_block.getNextBlock()) {
    output += codelabGenerator.blockToCode(child_block.getNextBlock());
    child_block = child_block.getNextBlock();
  };

  return output;
};

codelabGenerator['gpt_2'] = function(block) {
  var script_path = block.getFieldValue('path');
  var model_name = block.getFieldValue('name');
  var script_name = script_path.split('\\').slice(-1);
  var folder = script_path.split('\\').slice(0, -1).join('\\');
  return `
  [Route("/blog/edit/{id?}/generatecontent")]
  [HttpPost]
  public async Task<IActionResult> GenerateContent(string startingText, string id)
  {
      var command = "` + script_name + ` --seed 1 --model_name ` + model_name + ` --sentences=\\\"" + startingText + "\\\"";
      var directory = @"` + folder + `";
      var result = this.ExecutePython(command, directory);

      var post = await this.blog.GetPostById(id).ConfigureAwait(false);

      post.StartingText = startingText;
      post.Content = result;

      return this.Redirect($"/blog/edit/{id}");
  }
  `
};

codelabGenerator['dalle'] = function(block) {
  var script_path = block.getFieldValue('path');
  var model_name = block.getFieldValue('name');
  var script_name = script_path.split('\\').slice(-1);
  var folder = script_path.split('\\').slice(0, -1).join('\\');
  return `
  [Route("/blog/edit/{id?}/visualizecontent")]
  [HttpPost]
  public async Task<IActionResult> VisualizeContent(string excerpt, string id)
  {
      var contentText = excerpt.Substring(0, 120);
      var command = "` + script_name + ` --dalle_path ` + model_name + ` --taming --bpe_path variety.bpe --vqgan_model_path vqgan.1024.model.ckpt --vqgan_config_path vqgan.1024.config.yml --num_images 1 --text \\\"" + contentText + "\\\"";
      var directory = @"` + folder + `";
      var result = this.ExecutePython(command, directory);

      var yes = result.Substring(0, 1);
      var post = await this.blog.GetPostById(id).ConfigureAwait(false);

      this.CopyImage(contentText);

      return this.Redirect($"/blog/edit/{id}");
  }
  `
};

codelabGenerator['t5'] = function(block) {
  var summarize_path = block.getFieldValue('path_summarize');
  var summarize_name = summarize_path.split('\\').slice(-1);
  var summarize_folder = summarize_path.split('\\').slice(0, -1).join('\\');
  var translate_path = block.getFieldValue('path_translate');
  var translate_name = translate_path.split('\\').slice(-1);
  var translate_folder = translate_path.split('\\').slice(0, -1).join('\\');
  return `
  [Route("/blog/edit/{id?}/summarizecontent")]
  [HttpPost]
  public async Task<IActionResult> SummarizeContent(string content, string id)
  {
      var command = "` + summarize_name + ` --text=\\\"" + content.Replace("<p>", string.Empty).Replace("</p>", string.Empty) + "\\\"";
      var directory = @"` + summarize_folder + `";
      var result = this.ExecutePython(command, directory);

      var post = await this.blog.GetPostById(id).ConfigureAwait(false);

      post.Excerpt = result;

      return this.Redirect($"/blog/edit/{id}");
  }

  [Route("/blog/edit/{id?}/translatecontent")]
  [HttpPost]
  public async Task<IActionResult> TranslateContent(string content, string id)
  {
      var command = "` + translate_name + ` --text=\\\"" + content.Replace("<p>", string.Empty).Replace("</p>", string.Empty) + "\\\"";
      var directory = @"` + translate_folder + `";
      var result = this.ExecutePython(command, directory);

      var post = await this.blog.GetPostById(id).ConfigureAwait(false);

      post.Content = content + "\\n\\n" + result;

      return this.Redirect($"/blog/edit/{id}");
  }
  `
};