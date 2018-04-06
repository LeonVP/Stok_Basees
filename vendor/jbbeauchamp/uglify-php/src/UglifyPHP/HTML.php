<?php

namespace UglifyPHP;

class HTML extends Uglify
{
    protected static $location = 'html-minifier';
    protected static $exists_check = ' -V';
    protected static $options = [
        'case-sensitive',
        'collapse-boolean-attributes',
        'collapse-inline-tag-whitespace',
        'collapse-whitespace',
        'conservative-collapse',
        'custom-attr-assign',
        'custom-attr-collapse',
        'custom-attr-surround',
        'custom-event-attributes',
        'decode-entities',
        'html5',
        'ignore-custom-comments',
        'ignore-custom-fragments',
        'include-auto-generated-tags',
        'keep-closing-slash',
        'max-line-length',
        'minify-css',
        'minify-js',
        'minify-urls',
        'preserve-line-breaks',
        'prevent-attributes-escaping',
        'process-conditional-comments',
        'process-scripts',
        'quote-character',
        'remove-attribute-quotes',
        'remove-comments',
        'remove-empty-attributes',
        'remove-empty-elements',
        'remove-optional-tags',
        'remove-redundant-attributes',
        'remove-script-type-attributes',
        'remove-style-link-type-attributes',
        'remove-tag-whitespace',
        'sort-attributes',
        'sort-class-name',
        'trim-custom-fragments',
        'use-short-doctype',
    ];
    protected static $option_place = 'before';

    private function options_string($opts)
    {
        $options = array();

        foreach ($opts as $name => $value) {
            if (in_array($name, static::$options)) {
                if ($value === true) {
                    $options[] = '--' . $name;
                } else if (is_string($value)) {
                    $options[] = '--' . $name . ' ' . escapeshellarg($value);
                } else {
                    throw new \Exception('Value of "' . $name . '" in ' . get_called_class() . ' must be a string');
                }
            } else {
                throw new \Exception('Unsupported option "' . $name . '" in ' . get_called_class());
            }
        }

        return implode(' ', $options);
    }

    public function minify($path, $opts = array())
    {
        $path = escapeshellarg($path);
        $files = implode(' ', array_map(function ($file) {
            return escapeshellarg($file);
        }, $this->files));
        $options = $this->options_string($opts);
        $exec = static::$location;
        $cmd = "{$exec} {$options} {$files}";
        exec($cmd, $output, $return);

        if ($return === 0) {
            return $output[0];
        }

        return false;
    }
}
