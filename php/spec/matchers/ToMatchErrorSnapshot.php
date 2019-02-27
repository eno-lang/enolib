<?php declare(strict_types=1);

namespace Eno\Matchers;
use Eno\Error;

class ToMatchErrorSnapshot extends ToMatchSnapshot
{
  public static function match($actual, string $snapshot_file) {
    $actual = "--- message\n" . $actual->message . "\n--- selection\n" . json_encode($actual->selection);

    return parent::match($actual, $snapshot_file);
  }
}
