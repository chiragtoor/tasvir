// RNTMapManager.m
#import <MapKit/MapKit.h>

#import <React/RCTViewManager.h>
#import <AVFoundation/AVFoundation.h>

@interface RNTTest : RCTViewManager
@property (nonatomic, strong) UIView *myView;
@end

@implementation RNTTest

RCT_EXPORT_MODULE()

- (UIView *)view
{
  NSLog(@"TASVIR-1.3: RENDERING THE MAPVIEW OBJ-C Code");
  _myView = [[UIView alloc] initWithFrame:[UIScreen mainScreen].applicationFrame];
  _myView.layer.masksToBounds = YES;
  _myView.layer.cornerRadius = 5;
  _myView.translatesAutoresizingMaskIntoConstraints = NO;

  UILabel *yourLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, 10, 100, 20)];
  
  [yourLabel setTextColor:[UIColor blackColor]];
  [yourLabel setBackgroundColor:[UIColor clearColor]];
  [yourLabel setText:@"THIS IS SOME TEXT"];
  [yourLabel setFont:[UIFont fontWithName: @"Trebuchet MS" size: 24.0f]];
  [yourLabel setCenter:_myView.center];
  [_myView addSubview:yourLabel];
  
  return _myView;
}

RCT_EXPORT_METHOD(test:(NSInteger)orientation) {
  NSLog(@"TASVIR-1.3: CALLED EXPORTED METHOD");
}

@end


