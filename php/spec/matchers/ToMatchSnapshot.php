<?php declare(strict_types=1);

namespace Eno\Matchers;

class ToMatchSnapshot
{
  public static $_description = [];

  public static function match($actual, string $snapshot_file) {
    $extension = pathinfo($snapshot_file, PATHINFO_EXTENSION);
    $snapshot = @file_get_contents($snapshot_file);

    // When comparing object vs. object through JSON serialization
    // we do the comparison not with objects but with the serialized
    // json string, because when serializing back into php from json
    // we get different objects than the ones used for serialization
    // and the comparison is thus always unequal even for identical data.
    // (or in other words: roundtrip serialization does not work in php)
    if($extension === "json") {
      $actual = json_encode($actual, JSON_PRETTY_PRINT);
    }

    if($snapshot === false) {
      static::_buildDescription($actual, $actual);
      file_put_contents($snapshot_file, $actual);

      return true;
    } else {
      $match = $actual === $snapshot;

      if($match) {
        static::_buildDescription($actual, $snapshot);
      } else {
        $diff_file = $snapshot_file . ".actual";
        file_put_contents($diff_file, $actual);
        static::_buildDescription($actual, $snapshot, $diff_file);
      }

      return $match;
    }
  }

  public static function _buildDescription($actual, $expected, string $diff_file = null)
  {
      $description = "match the content of the stored snapshot file.";
      $data['actual'] = $actual;
      $data['expected'] = $expected;

      if($diff_file) {
        $data['diff file'] = $diff_file;
      }

      static::$_description = compact('description', 'data');
  }

  public static function description()
  {
    return static::$_description;
  }
}
