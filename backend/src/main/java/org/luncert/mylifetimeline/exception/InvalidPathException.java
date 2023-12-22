package org.luncert.mylifetimeline.exception;

public class InvalidPathException extends StorageException {

  public InvalidPathException(String message) {
    super(message);
  }

  public InvalidPathException(String message, Throwable cause) {
    super(message, cause);
  }
}
